from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from geoalchemy2.elements import WKTElement
from geoalchemy2.functions import ST_Y, ST_DWithin, ST_Distance, ST_X

from app.database import get_db
from app.models.service import Service
from app.schemas.service_schema import ServiceCreate, ServiceUpdate
from app.core.security import get_current_user


router = APIRouter(
    prefix="/services",
    tags=["Services"]
)

@router.post("/add")
def add_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    point = WKTElement(
        f"POINT({service.lon} {service.lat})",
        srid=4326
    )

    new_service = Service(
        name=service.name,
        category=service.category,
        location=point
    )

    db.add(new_service)
    db.commit()

    return {"message": "Service added successfully"}



@router.get("/list")
def list_services(
    category: str = None,
    db: Session = Depends(get_db)
):

    query = db.query(Service)

    if category:
        query = query.filter(Service.category == category)

    services = query.all()

    return [
        {
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "rating": s.rating,
            "latitude": db.scalar(ST_Y(s.location)),
            "longitude": db.scalar(ST_X(s.location))
        }
        for s in services
    ]


@router.get("/nearby")
def nearby_services(
    latitude: float,
    longitude: float,
    radius: int,
    category: str = None,
    db: Session = Depends(get_db)
):

    user_location = WKTElement(
        f"POINT({longitude} {latitude})",
        srid=4326
    )

    query = db.query(
        Service,
        ST_Distance(Service.location, user_location).label("distance")
    ).filter(
        ST_DWithin(Service.location, user_location, radius * 1000)
    )

    
    if category:
        query = query.filter(Service.category == category)

    
    results = query.order_by("distance", Service.rating.desc()).all()

    return [
        {
            "id": service.id,
            "name": service.name,
            "category": service.category,
            "rating": service.rating,
            "distance_km": round(float (distance) / 1000, 2)
        }
        for service, distance in results
    ]

@router.put("/update/{service_id}")
def update_service(
    service_id: int,
    service: ServiceUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    existing_service = db.query(Service).filter(Service.id == service_id).first()

    if not existing_service:
        raise HTTPException(status_code=404, detail="Service not found")

    if service.name:
        existing_service.name = service.name

    if service.category:
        existing_service.category = service.category

    db.commit()

    return {"message": "Service updated successfully"}



@router.delete("/delete/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    service = db.query(Service).filter(Service.id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    db.delete(service)
    db.commit()

    return {"message": "Service deleted successfully"}