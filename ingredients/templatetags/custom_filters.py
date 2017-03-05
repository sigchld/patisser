from django import template
from collections import OrderedDict 

register = template.Library()

@register.filter(name='sort')
def listsort(value):
        if isinstance(value, dict):
            new_dict = OrderedDict()
            key_list = value.keys()
            key_list.sort(key=lambda s: s.lower())
            for key in key_list:
                new_dict[key] = value[key]
            return new_dict
        elif isinstance(value, list):
            new_list = list(value)
            if len(new_list) > 1:
                elem = new_list[0]
                if isinstance(elem, tuple):
                        new_list.sort(key=lambda s: s[0].lower())
                elif isinstance(elem, str):
                        new_list.sort(key=lambda s: s.lower())
                else:
                        new_list.sort()
            return new_list
        else:
            return value
        listsort.is_safe = True
