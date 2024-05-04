# Generated by Django 5.0.4 on 2024-04-24 23:52

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_transaction_paid'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='order',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]