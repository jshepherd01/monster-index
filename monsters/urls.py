from django.urls import path
from . import views

urlpatterns = [
     path('',views.index,name='index'),
     path('monster/<int:pk>/',views.monsterGet, name='monsterGet'),
     path('monster/add/',views.monsterAdd, name='monsterAdd'),
     path('monster/<int:pk>/edit/',views.monsterEdit, name='monsterEdit'),
     path('monster/<int:pk>/delete/',views.monsterDelete, name='monsterDelete'),
     path('tag/add/',views.tagAdd, name='tagAdd'),
     path('tag/<int:pk>/edit/',views.tagEdit, name='tagEdit'),
     path('tag/<int:pk>/delete/',views.tagDelete, name='tagDelete'),
     path('category/add/',views.categoryAdd, name='categoryAdd'),
     path('category/<int:pk>/edit/',views.categoryEdit, name='categoryEdit'),
     path('category/<int:pk>/delete/',views.categoryDelete, name='categoryDelete'),
     path('source/add/',views.sourceAdd, name='sourceAdd'),
     path('source/<int:pk>/edit/',views.sourceEdit, name='sourceEdit'),
     path('source/<int:pk>/delete/',views.sourceDelete, name='sourceDelete'),
     path('render/<str:template>/', views.renderTemplate, name='render'),
]
