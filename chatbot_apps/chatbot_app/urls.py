"""chatbot_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('about/', views.about, name='about'),
    path('chat/', views.chat, name='chat'),
    path('registry/', views.registryUser, name='registry'),
    path('registry_user/', views.registryFriend, name='registry_friend'),
    path('predict/', views.predict, name='predict'),
    path('preserve/', views.preserve, name='preserve'),
    path('learning/', views.learning, name='learning'),
    path('training/', views.training, name='training'),
    path('reply/', views.reply, name='reply'),
]
