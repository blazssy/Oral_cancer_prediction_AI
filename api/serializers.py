from rest_framework import serializers
from .models import Patient, ClinicalImage, Prediction

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'