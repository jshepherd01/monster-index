# Generated by Django 3.1.7 on 2021-05-04 16:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monsters', '0004_auto_20210504_1601'),
    ]

    operations = [
        migrations.AddField(
            model_name='tag',
            name='info',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
    ]
