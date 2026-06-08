from django.urls import path
from .views import PredictView, GeminiChatView

urlpatterns = [
    path('predict/', PredictView.as_view(), name='predict'),
    path('gemini-chat/', GeminiChatView.as_view(), name='gemini-chat'),
]