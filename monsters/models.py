from django.db import models
from django.core.validators import MinValueValidator

class TagCat(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=200, unique=True)
    category = models.ForeignKey(TagCat, on_delete=models.CASCADE)
    info = models.TextField()

    class Meta:
        ordering = ['category', 'name']
    
    def __str__(self):
        return f'{self.category.name}: {self.name}'

class Source(models.Model):
    name = models.CharField(max_length=200)
    abbr_name = models.CharField('Abbreviated name', max_length=12, unique=True)
    official = models.BooleanField()
    pages = models.PositiveIntegerField(default=None, validators=[MinValueValidator(1)], null=True, blank=True)

    class Meta:
        ordering = ['-official', 'abbr_name']

    def __str__(self):
        return self.name
    
class CR(models.Model):
    text_form = models.CharField(max_length=10)
    int_form = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.text_form} ({self.int_form:,} XP)'
    

class Monster(models.Model):
    name = models.CharField(max_length=200)
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    page = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    tag = models.ManyToManyField(Tag)
    xp = models.ForeignKey(CR, null=True, blank=True, on_delete=models.SET_NULL)
    info = models.TextField(blank=True)

    def get_source_pages(self):
        return None

    def to_dict(self):
        res = {}
        res['name'] = self.name
        res['source-pk'] = self.source.pk
        res['source'] = str(self.source)
        res['page'] = self.page
        res['tag-pk'] = [i.pk for i in self.tag.all()]
        res['tag'] = [str(i) for i in self.tag.all()]
        res['xp-pk'] = self.xp.pk
        res['xp'] = str(self.xp)
        res['info'] = self.info
        return res

    def __str__(self):
        if self.xp:
            return f'{self.name} (CR {self.xp.text_form})'
        else:
            return self.name
