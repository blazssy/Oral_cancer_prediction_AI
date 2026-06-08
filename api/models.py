from django.db import models

class Patient(models.Model):
    # Patient demographic and habit information
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    region = models.CharField(max_length=50, null=True, blank=True)
    tobacco_use = models.CharField(max_length=50, null=True, blank=True)
    alcohol_use = models.BooleanField(default=False)
    betel_nut_use = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Patient {self.id}"

class ClinicalImage(models.Model):
    # Link to the patient and the image file
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='images')
    image_file = models.ImageField(upload_to='clinical_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id} for Patient {self.patient.id}"

class Prediction(models.Model):
    # The result of an AI model prediction
    image = models.OneToOneField(ClinicalImage, on_delete=models.CASCADE, related_name='prediction')
    predicted_class = models.CharField(max_length=100)
    confidence_score = models.FloatField()
    prediction_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.predicted_class} ({self.confidence_score:.2f}) for Image {self.image.id}"