# Generated by Django 3.1.7 on 2021-06-08 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monsters', '0012_auto_20210522_1828'),
    ]

    operations = [
        migrations.AddField(
            model_name='monster',
            name='info',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
