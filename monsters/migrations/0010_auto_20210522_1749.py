# Generated by Django 3.1.7 on 2021-05-22 17:49

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monsters', '0009_auto_20210518_1917'),
    ]

    operations = [
        migrations.AlterField(
            model_name='source',
            name='pages',
            field=models.PositiveIntegerField(blank=True, default=None, null=True, validators=[django.core.validators.MinValueValidator(1)]),
        ),
    ]
