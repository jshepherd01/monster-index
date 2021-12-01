from django.contrib import admin

from .models import Monster, Tag, TagCat, Source, CR

admin.site.register(Monster)
admin.site.register(Tag)
admin.site.register(TagCat)
admin.site.register(Source)
admin.site.register(CR)