from django.http.response import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseBadRequest
from django.urls import reverse
from .models import Monster, Tag, TagCat, Source, CR

def index(request):
    category_list = TagCat.objects.all()
    source_list = Source.objects.all()
    monster_list = Monster.objects.all()
    cr_list = CR.objects.all()
    return render(request, 'monsters/edit.html', {
        'category_list': category_list,
        'source_list': source_list,
        'cr_list': cr_list,
        'monster_list': monster_list
    })

def monsterGet(request, pk):
    monster = get_object_or_404(Monster, pk=pk)
    return JsonResponse(monster.to_dict())

def monsterAdd(request):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))
    if any(i not in request.POST for i in ['name','xp','source','page']):
        return HttpResponseBadRequest()
    
    name = request.POST['name']
    xppk = request.POST['xp']
    sourcepk = request.POST['source']
    page = request.POST['page']
    tagpks = []
    if 'tag' in request.POST: tagpks = request.POST.getlist('tag')
    info = ""
    if 'info' in request.POST: info = request.POST['info']

    c = get_object_or_404(CR, pk=xppk)
    s = get_object_or_404(Source, pk=sourcepk)
    t = [get_object_or_404(Tag, pk=i) for i in tagpks]

    print(tagpks)
    print(t)

    m = Monster(name=name, xp=c, page=page, info=info, source=s)
    m.save()

    m.tag.set(t)
    m.save()

    return JsonResponse({'pk': m.pk})

def monsterEdit(request, pk):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))
    
    m = get_object_or_404(Monster, pk=pk)

    if 'name' in request.POST:
        m.name = request.POST['name']
    if 'xp' in request.POST:
        c = get_object_or_404(CR, pk=request.POST['xp'])
        m.xp = c
    if 'info' in request.POST:
        m.info = request.POST['info']
    if 'source' in request.POST:
        s = get_object_or_404(Source, pk=request.POST['source'])
        m.source = s
    if 'page' in request.POST:
        m.page = request.POST['page']
    if 'tag' in request.POST:
        tagpks = request.POST.getlist('tag')
        t = [get_object_or_404(Tag, pk=i) for i in tagpks]
        m.tag.set(t)
    
    m.save()

    return JsonResponse({'pk': m.pk})

def monsterDelete(request, pk):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))

    m = get_object_or_404(Monster, pk=pk)
    m.delete()

    return HttpResponse()

def tagAdd(request):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))
    if any(i not in request.POST for i in ['name','catpk']):
        return HttpResponseBadRequest()
    
    name = request.POST['name']
    catpk = request.POST['catpk']
    info = ""
    if 'info' in request.POST:
        info = request.POST['info']
    
    category = get_object_or_404(TagCat, pk=catpk)
    t = Tag(name=name, category=category, info=info)
    t.save()

    return HttpResponse()

def tagEdit(request, pk):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))

    t = get_object_or_404(Tag, pk=pk)

    if 'name' in request.POST:
        t.name = request.POST['name']
    if 'catpk' in request.POST:
        category = get_object_or_404(TagCat, pk=request.POST['catpk'])
        t.category = category
    if 'info' in request.POST:
        t.info = request.POST['info']
    
    t.save()

    return HttpResponse()

def tagDelete(request, pk):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))

    t = get_object_or_404(Tag, pk=pk)
    t.delete()

    return HttpResponse()

def categoryAdd(request):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))
    if (not 'name' in request.POST):
        return HttpResponseBadRequest()
    
    name = request.POST['name']
    
    c = TagCat(name=name)
    c.save()

    return HttpResponse()

def categoryEdit(request, pk):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))

    c = get_object_or_404(TagCat, pk=pk)

    if 'name' in request.POST:
        c.name = request.POST['name']
    
    c.save()

    return HttpResponse()

def categoryDelete(request, pk):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))

    c = get_object_or_404(TagCat, pk=pk)
    c.delete()

    return HttpResponse()

def sourceAdd(request):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))
    if any(i not in request.POST for i in ['name','abbr']):
        return HttpResponseBadRequest()
    
    name = request.POST['name']
    abbr = request.POST['abbr']
    official = False
    if 'official' in request.POST:
        if request.POST['official'].upper() == 'TRUE' or request.POST['official'].upper() == 'FALSE':
            official = (request.POST['official'].upper() == 'TRUE')
        else:
            return HttpResponseBadRequest()
    pages = None
    if 'pages' in request.POST:
        if request.POST['pages'].isnumeric():
            pages = int(request.POST['pages'])
        elif request.POST['pages'].upper() == "NULL":
            pages = None
        else:
            return HttpResponseBadRequest()
    
    s = Source(name=name, abbr_name=abbr, official=official, pages=pages)
    s.save()

    return HttpResponse()

def sourceEdit(request, pk):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))

    s = get_object_or_404(Source, pk=pk)

    if 'name' in request.POST:
        s.name = request.POST['name']
    if 'abbr' in request.POST:
        s.abbr_name = request.POST['abbr']
    if 'official' in request.POST:
        s.official = official = (request.POST['official'].upper() == 'TRUE')
    if 'pages' in request.POST:
        if request.POST['pages'].isnumeric():
            s.pages = int(request.POST['pages'])
        elif request.POST['pages'].upper() == "NULL":
            s.pages = None
    
    s.save()

    return HttpResponse()

def sourceDelete(request, pk):
    if not request.method == 'POST':
        return HttpResponseRedirect(reverse('monsters:index'))

    s = get_object_or_404(Source, pk=pk)
    s.delete()

    return HttpResponse()

def renderTemplate(request, template):
    context_dict = {
        'tag_list': {
            'category_list': TagCat.objects.all(),
        },
        'modal_tag_form': {
            'category_list': TagCat.objects.all(),
        },
        'source_list': {
            'source_list': Source.objects.all(),
        },
        'monster_list': {
            'monster_list': Monster.objects.all(),
            'cr_list': CR.objects.all(),
        },
    }
    if template in context_dict:
        context = context_dict[template]
    else:
        context = {}

    return render(request, f'monsters/{template}.html', context)
