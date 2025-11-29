import pytest
from bson import ObjectId

from app.models.common import MongoBaseModel, PyObjectId


class SampleModel(MongoBaseModel):
    name: str


def test_pyobjectid_accepts_valid_string():
    oid = ObjectId()
    validated = PyObjectId.validate(str(oid))
    assert isinstance(validated, ObjectId)
    assert validated == oid


def test_pyobjectid_rejects_invalid_string():
    with pytest.raises(ValueError):
        PyObjectId.validate("not-a-valid-object-id")


def test_mongo_base_model_serializes_object_id_alias():
    model = SampleModel(name="Example")
    dumped = model.model_dump(by_alias=True)
    assert "_id" in dumped and isinstance(dumped["_id"], ObjectId)

    json_dump = model.model_dump(mode="json", by_alias=True)
    assert isinstance(json_dump["_id"], str)

