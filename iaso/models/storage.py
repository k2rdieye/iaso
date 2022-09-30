import uuid
from django.db import models

from iaso.models import Entity, Instance, OrgUnit, Account


class StorageDevice(models.Model):
    """
    A storage device used by the mobile application

    For the first use-case (current situation), storage devices are NFC cards that are linked to an entity (a person).

    We'd like to keep that flexible (potentially, other storage devices type could be used for other purposes), so it's
    important to keep this model pretty generic (business logic and specific data and logic pushed to as much as possible
    to StorageLogEntry and to the API).

    StorageDevices are linked to an account, only users from the correct account can see/use/edit them.
    """

    NFC = "NFC"
    USB = "USB"
    SD = "SD"

    STORAGE_TYPE_CHOICES = [
        (NFC, "NFC"),
        (USB, "USB"),
        (SD, "SD"),
    ]

    # A unique identifier for the storage device in a given account.
    # At the database level, the real PK is the Django autogenerated one.
    customer_chosen_id = models.CharField(max_length=255)
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    type = models.CharField(max_length=8, choices=STORAGE_TYPE_CHOICES)

    class Meta:
        unique_together = ("customer_chosen_id", "account")


class StorageLogEntry(models.Model):
    """
    This model keeps track of all the operations that were performed on a storage device, this is important for
    auditability reasons.

    Realistically, many fields on this model are probably specific to our first use-case (NFC cards linked to people in
    entities): operations, link to entity and org_unit, etc.

    In the current implementation/use-case, a card is linked to an entity (= a person), and store:
    - a profile (metadata about the person)
    - a list of RECORDS (that represent visits to this person), as records in a circular buffer
    Possible operations are:

    - WRITE_PROFILE: when a profile is written on the storage device, this automatically links the device to the entity
    (that represents a person).
    - RESET: used to reset the storage device. This operation will also wipe the profile, and therefore nullify the
    link to the entity.
    - READ: all data is read from the card (profile + all records)
    - WRITE_RECORD: a new record is written on the storage device
    - CHANGE_STATUS: the status of the storage device is changed (e.g. from "OK" to "BLACKLISTED"). This is cannot be
    done from the mobile app on the field, but via a manager using the web interface.
    """

    WRITE_PROFILE = "WRITE_PROFILE"
    RESET = "RESET"
    READ = "READ"
    WRITE_RECORD = "WRITE_RECORD"
    CHANGE_STATUS = "CHANGE_STATUS"

    OPERATION_TYPE_CHOICES = [
        (WRITE_PROFILE, "WRITE_PROFILE"),
        (RESET, "RESET"),
        (READ, "READ"),
        (WRITE_RECORD, "WRITE_RECORD"),
        (CHANGE_STATUS, "CHANGE_STATUS"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    device = models.ForeignKey(StorageDevice, on_delete=models.CASCADE)
    operation_type = models.CharField(max_length=32, choices=OPERATION_TYPE_CHOICES)
    # when as te data read/written on the storage device. This is chosen by the mobile app, that can happen earlier than
    # when the backend knows about it.
    performed_at = models.DateTimeField()
    # Multiple instances/submissions can be saved on a StorageDevice
    instances = models.ManyToManyField(Instance, blank=True, related_name="storage_log_entries")
    org_unit = models.ForeignKey(OrgUnit, on_delete=models.SET_NULL, null=True, blank=True)
    entity = models.ForeignKey(Entity, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["-performed_at"]
