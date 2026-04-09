from django.db import models

class SeismicZone(models.Model):
    id = models.AutoField(primary_key=True)
    zone_name = models.CharField(max_length=50, unique=True)
    seismic_factor = models.FloatField()

    class Meta:
        db_table = 'seismic_zones'
        managed = False

class State(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'states'
        managed = False

class Station(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    state = models.ForeignKey(State, on_delete=models.CASCADE, db_column='state_id')
    max_temp_c = models.FloatField()
    min_temp_c = models.FloatField()
    wind_speed_ms = models.FloatField(null=True, blank=True)
    seismic_zone = models.ForeignKey(SeismicZone, on_delete=models.SET_NULL, null=True, blank=True, db_column='seismic_zone_id')

    class Meta:
        db_table = 'stations'
        managed = False
