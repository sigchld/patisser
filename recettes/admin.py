from django.contrib import admin

# Register your models here.
import logging

from django.contrib import admin
from django.utils.html import format_html
from .models import Ingredient
from .models import Element
from .models import Preparation
from .models import PreparationRecette
from .models import Recette
from .models import Categorie
from .models import Photo
from .models import EtapePreparation
from .models import EtapeRecette
from imagekit.admin import AdminThumbnail

# Get an instance of a logger
logger = logging.getLogger(__name__)


class PreparationRecetteInlineAdmin(admin.TabularInline):
    model = PreparationRecette
    extra = 4
    def get_extra (self, request, obj=None, **kwargs):
        """Dynamically sets the number of extra forms. 0 if the related object
        already exists or the extra configuration otherwise."""
        if obj:
            # Don't add any extra forms if the related object already exists.
            return 0
        return self.extra

class EtapesRecetteInlineAdmin(admin.TabularInline):
    model = EtapeRecette
    extra = 4
    def get_extra (self, request, obj=None, **kwargs):
        """Dynamically sets the number of extra forms. 0 if the related object
        already exists or the extra configuration otherwise."""
        if obj:
            # Don't add any extra forms if the related object already exists.
            return 0
        return self.extra

    
class RecetteAdmin(admin.ModelAdmin):
    inlines = [PreparationRecetteInlineAdmin, EtapesRecetteInlineAdmin]
#    fields = ( 'image_tag', )
#    readonly_fields = ('image_tag',)

class ElementsInlineAdmin(admin.TabularInline):
    model = Element
    extra = 4
    def get_extra (self, request, obj=None, **kwargs):
        """Dynamically sets the number of extra forms. 0 if the related object
        already exists or the extra configuration otherwise."""
        if obj:
            # Don't add any extra forms if the related object already exists.
            return 0
        return self.extra

class EtapesPreparationInlineAdmin(admin.TabularInline):
    model = EtapePreparation
    extra = 4
    def get_extra (self, request, obj=None, **kwargs):
        """Dynamically sets the number of extra forms. 0 if the related object
        already exists or the extra configuration otherwise."""
        if obj:
            # Don't add any extra forms if the related object already exists.
            return 0
        return self.extra


class PreparationAdmin(admin.ModelAdmin):
    inlines = [ElementsInlineAdmin, EtapesPreparationInlineAdmin]


class PhotoAdmin(admin.ModelAdmin):
    list_display = ['code', 'description', 'image_display']
    image_display = AdminThumbnail(image_field='photo')
    image_display.short_description = 'Image'
#    def image_tag(self, obj):
#        return format_html('<img width=200 height=200 src="/recettes/{}" />'.format(obj.photo.url))
#    image_tag.short_description = 'Image'




admin.site.register(Ingredient)
admin.site.register(Preparation, PreparationAdmin)
admin.site.register(Recette, RecetteAdmin)
admin.site.register(Categorie)
admin.site.register(Photo, PhotoAdmin)
