# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='negative_reports',
            new_name='reports',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='positive_reports',
            new_name='views',
        ),
    ]
