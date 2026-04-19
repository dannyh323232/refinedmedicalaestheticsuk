#!/usr/bin/env python3
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path

API_VERSION = "2024-10"
GA4_ID = "G-5JSFZX11H2"
CONFIG_PATH = Path('/data/.openclaw/secure/shopify-refined-builder-client.txt')


def load_conf():
    conf = {}
    for line in CONFIG_PATH.read_text().splitlines():
        if '=' in line:
            k, v = line.split('=', 1)
            conf[k.strip()] = v.strip()
    return conf


CONF = load_conf()
SHOP = CONF['store']
TOKEN = CONF['access_token']
BASE = f'https://{SHOP}/admin/api/{API_VERSION}'
JSON_HEADERS = {'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json'}
AUTH_HEADERS = {'X-Shopify-Access-Token': TOKEN}


def rest(method, path, data=None):
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(BASE + path, data=body, method=method, headers=JSON_HEADERS if body is not None else AUTH_HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = resp.read().decode()
        return json.loads(raw) if raw else {}


def graphql(query, variables=None):
    payload = {'query': query}
    if variables is not None:
        payload['variables'] = variables
    req = urllib.request.Request(BASE + '/graphql.json', data=json.dumps(payload).encode(), method='POST', headers=JSON_HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())


def get_asset(theme_id, key):
    quoted = urllib.parse.quote(key, safe='/')
    req = urllib.request.Request(BASE + f'/themes/{theme_id}/assets.json?asset[key]={quoted}', headers=AUTH_HEADERS)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode())['asset']['value']


def put_asset(theme_id, key, value):
    return rest('PUT', f'/themes/{theme_id}/assets.json', {'asset': {'key': key, 'value': value}})


def strip_first_h1(html):
    return re.sub(r'<h1[^>]*>.*?</h1>', '', html, count=1, flags=re.I | re.S).strip()


def product_top_html(intro, bullets):
    lis = ''.join(f'<li>{b}</li>' for b in bullets)
    return (
        f'<p>{intro}</p>'
        f'<ul>{lis}</ul>'
        '<p><strong>Need help choosing the right product?</strong> '
        'Contact Refined Medical Aesthetics before ordering for straightforward nurse-led guidance.</p>'
    )


def product_tail_html():
    return (
        '<hr>'
        '<h2>Why shop with Refined Medical Aesthetics?</h2>'
        '<p>Products are selected with a nurse-led, clinic-first approach focused on practical homecare, healthy skin, and realistic routines.</p>'
        '<h3>Helpful links</h3>'
        '<ul>'
        '<li><a href="/collections/medical-grade-essentials">Browse medical grade essentials</a></li>'
        '<li><a href="/pages/about-refined">Meet Nurse Rachel</a></li>'
        '<li><a href="/pages/contact">Contact the clinic before ordering</a></li>'
        '</ul>'
        '<h3>FAQ</h3>'
        '<p><strong>Can I use this after treatment?</strong><br>Suitability depends on the treatment and timing. If you are unsure, contact the clinic before ordering or using a product post-treatment.</p>'
        '<p><strong>How do I know if this product is right for my skin?</strong><br>If you are unsure which product best fits your routine, Refined Medical Aesthetics can offer straightforward guidance before you buy.</p>'
    )


PRODUCTS = {
    'prebiotic-cleanser': {
        'title_tag': 'Prebiotic Cleansing Balm | Refined Medical Aesthetics',
        'meta': 'Gentle prebiotic cleansing balm with cloth to remove makeup, impurities, and daily build-up while supporting balanced, comfortable skin.',
        'intro': 'A gentle cleansing balm designed to melt away makeup, SPF, and daily build-up while helping support soft, balanced skin. Ideal for anyone wanting an effective first cleanse that still feels nourishing and comfortable.',
        'bullets': ['Supports a calm, balanced cleanse', 'Helps remove makeup, SPF, and impurities', 'Leaves skin feeling soft and nourished', 'Includes organic cotton and bamboo cloth', 'Easy to use as part of an evening routine']
    },
    'bog-myrtle-and-lime-balancing-cleanser-refill': {
        'title_tag': 'Balancing Cleanser Refill | Refined Medical Aesthetics',
        'meta': 'Refill pouch for the Bog Myrtle and Lime Balancing Cleanser. A practical way to maintain a fresh, balanced daily cleansing routine.',
        'intro': 'A convenient refill option for maintaining your regular cleansing routine. Ideal for anyone already using the balancing cleanser and wanting an easy, lower-waste top-up.',
        'bullets': ['Refill format for repeat users', 'Supports a simple daily routine', 'Practical skincare top-up option', 'Designed for fresh, balanced cleansing']
    },
    'bog-myrtle-and-lime-balancing-cleanser': {
        'title_tag': 'Balancing Cleanser | Refined Medical Aesthetics',
        'meta': 'Fresh daily balancing cleanser from Refined Medical Aesthetics. A simple option for skin that benefits from a clean, comfortable finish.',
        'intro': 'A daily cleanser designed to leave skin feeling fresh, clean, and comfortable without overcomplicating your routine. A good fit for those who want straightforward everyday cleansing.',
        'bullets': ['Fresh daily cleanser', 'Helps support a balanced skin feel', 'Simple, easy-to-use routine step', 'Suitable for everyday homecare']
    },
    '3-pack-prep-hydrate-facial-mist': {
        'title_tag': '3 Pack Prep Mist | Refined Medical Aesthetics',
        'meta': 'Triple pack of hydrating Prep Mist for fresh, easy skin prep and on-the-go hydration. A practical homecare staple for everyday use.',
        'intro': 'A convenient multi-pack of hydrating facial mist designed to refresh skin, prep before makeup, and support a more comfortable feel throughout the day.',
        'bullets': ['Hydrating facial mist', 'Useful for skin prep before makeup', 'Great for keeping on hand at home or in your bag', 'Multi-pack convenience']
    },
    'prep-mist-refill': {
        'title_tag': 'Prep Mist Refill | Refined Medical Aesthetics',
        'meta': 'Refill your favourite hydrating Prep Mist with this practical top-up option from Refined Medical Aesthetics.',
        'intro': 'A refill option for those already using Prep Mist and wanting a simple way to keep their daily hydration step going.',
        'bullets': ['Refill option for regular users', 'Supports easy day-to-day hydration', 'Simple skincare maintenance step', 'Convenient top-up format']
    },
    'prep-mist': {
        'title_tag': 'Prep Mist | Hydrating Facial Mist | Refined Medical Aesthetics',
        'meta': 'Hydrating facial mist to refresh skin, prep before makeup, and support a smooth, comfortable finish throughout the day.',
        'intro': 'A hydrating facial mist designed to refresh skin, prep before makeup, and give your routine an easy hydration boost. Ideal for everyday use when you want something quick, simple, and effective.',
        'bullets': ['Refreshes and hydrates skin', 'Helps prep skin before makeup', 'Easy everyday routine step', 'Handy for home or on the go']
    },
    'hydro-dots': {
        'title_tag': 'Hydro-Dots | Blemish Patches | Refined Medical Aesthetics',
        'meta': 'Hydro-Dots blemish patches designed to support targeted breakout care and protect spots from picking and irritation.',
        'intro': 'Targeted blemish patches designed to support breakout care, help protect irritated areas, and make it easier to leave spots alone while skin settles.',
        'bullets': ['Targeted breakout support', 'Helps reduce picking and touching', 'Easy to use overnight or during the day', 'Practical addition to blemish-prone routines']
    },
    'soapbrows-and-prep-mist': {
        'title_tag': 'Soap Brows Original | Refined Medical Aesthetics',
        'meta': 'Shop Soap Brows Original from Refined Medical Aesthetics for tidy, defined brows and an easy everyday finish.',
        'intro': 'A brow staple for shaping and setting brows with a clean, defined finish. Great for simple, polished everyday styling.',
        'bullets': ['Helps shape and hold brows', 'Easy everyday beauty staple', 'Clean, polished finish', 'Pairs well with Prep Mist']
    },
    'hydro-patch': {
        'title_tag': 'Hydro-Patch | Skin Patches | Refined Medical Aesthetics',
        'meta': 'Hydro-Patch targeted skin patches from Refined Medical Aesthetics for practical breakout and blemish support.',
        'intro': 'Targeted skin patches designed to support blemish care in a simple, mess-free way. Useful when you want a more practical option for visible areas.',
        'bullets': ['Practical blemish support', 'Easy targeted application', 'Helps protect the area', 'Simple routine addition']
    },
    'hydro-duo': {
        'title_tag': 'Hydro-Duo | Blemish Care Duo | Refined Medical Aesthetics',
        'meta': 'Hydro-Duo blemish care set from Refined Medical Aesthetics for simple, targeted support within an everyday skincare routine.',
        'intro': 'A targeted blemish care duo designed to help support clearer-looking skin with simple, practical routine steps.',
        'bullets': ['Targeted blemish support', 'Practical daily use', 'Easy addition to existing routine', 'Designed for simple homecare']
    }
}


def update_products(report):
    products = rest('GET', '/products.json?limit=250')['products']
    by_handle = {p['handle']: p for p in products}
    for handle, spec in PRODUCTS.items():
        p = by_handle[handle]
        detail = rest('GET', f'/products/{p["id"]}.json?fields=id,handle,title,body_html,metafields_global_title_tag,metafields_global_description_tag')['product']
        existing = strip_first_h1(detail.get('body_html') or '')
        body_html = product_top_html(spec['intro'], spec['bullets']) + existing + product_tail_html()
        payload = {
            'product': {
                'id': p['id'],
                'body_html': body_html,
                'metafields_global_title_tag': spec['title_tag'],
                'metafields_global_description_tag': spec['meta'],
            }
        }
        rest('PUT', f'/products/{p["id"]}.json', payload)
        report.append(f'Updated product SEO/content: {handle}')


def update_pages_and_collections(report):
    pages = {p['handle']: p for p in rest('GET', '/pages.json?limit=250')['pages']}
    collections = {c['handle']: c for c in rest('GET', '/custom_collections.json?limit=250')['custom_collections']}

    about_html = (
        '<h1>About Nurse Rachel</h1>'
        '<p>Refined Medical Aesthetics is led by Rachel, an NHS paediatric nurse and aesthetics practitioner based in Seaton Delaval near Whitley Bay. The clinic is built around calm, professional care, subtle results, and honest guidance.</p>'
        '<p>Alongside treatments, Rachel carefully selects clinic-approved homecare and medical grade skincare that fits real life. The aim is simple: help clients protect their skin, support their results, and feel confident in a routine they can actually stick to.</p>'
        '<h2>What to expect</h2>'
        '<ul>'
        '<li>Consultations that consider your lifestyle, skin health, and treatment goals before recommending anything.</li>'
        '<li>Nurse-led advice on skincare, aftercare, and realistic maintenance between appointments.</li>'
        '<li>A safety-first, trust-led approach with no pressure and no exaggerated promises.</li>'
        '</ul>'
        '<p><strong>Clinic location:</strong> Seaton Delaval, Northumberland, serving Whitley Bay, Cramlington, and surrounding areas.</p>'
        '<p><a href="/collections/medical-grade-essentials">Shop clinic-recommended skincare</a> · <a href="/pages/contact">Contact the clinic</a> · <a href="https://refinedmedicalaesthetics.uk/" target="_blank" rel="noopener">Visit the main clinic website</a></p>'
    )
    rest('PUT', f'/pages/{pages["about-refined"]["id"]}.json', {
        'page': {
            'id': pages['about-refined']['id'],
            'title': 'About Nurse Rachel',
            'body_html': about_html,
            'metafields_global_title_tag': 'About Nurse Rachel | Refined Medical Aesthetics',
            'metafields_global_description_tag': 'Meet Rachel, the nurse behind Refined Medical Aesthetics in Seaton Delaval. Trusted, professional, nurse-led aesthetics and clinic-approved skincare support.'
        }
    })
    report.append('Updated About page SEO/content')

    contact_html = (
        '<h1>Contact Refined Medical Aesthetics</h1>'
        '<p>If you need product guidance, aftercare advice, or want to ask a question before booking, get in touch with Refined Medical Aesthetics.</p>'
        '<p>Based in Seaton Delaval, the clinic supports clients across Whitley Bay, Northumberland, and nearby areas with nurse-led treatment planning and clinic-approved skincare support.</p>'
        '<p><a href="https://refinedmedicalaesthetics.uk/" target="_blank" rel="noopener">Visit the main clinic website</a> or browse <a href="/collections/medical-grade-essentials">medical grade essentials</a>.</p>'
    )
    rest('PUT', f'/pages/{pages["contact"]["id"]}.json', {
        'page': {
            'id': pages['contact']['id'],
            'body_html': contact_html,
            'metafields_global_title_tag': 'Contact Refined Medical Aesthetics',
            'metafields_global_description_tag': 'Contact Refined Medical Aesthetics for nurse-led skincare guidance, product help, and clinic enquiries from Seaton Delaval.'
        }
    })
    report.append('Updated Contact page SEO/content')

    wbco_html = (
        '<h1>WBco retail with clinic support</h1>'
        '<p>The WBco range at Refined Medical Aesthetics is selected to support simple, confidence-building homecare between appointments. Products are chosen with a nurse-led, clinic-first approach focused on healthy skin and realistic routines.</p>'
        '<p><strong>NMC registered nurse-led clinic.</strong> If you are unsure what fits your current routine, contact the clinic before ordering.</p>'
        '<p><a href="/collections/medical-grade-essentials">Shop medical grade essentials</a> · <a href="/pages/about-refined">Meet Nurse Rachel</a></p>'
    )
    rest('PUT', f'/pages/{pages["wbco-shop"]["id"]}.json', {
        'page': {
            'id': pages['wbco-shop']['id'],
            'title': 'WBco Retail at Refined',
            'body_html': wbco_html,
            'metafields_global_title_tag': 'WBco Retail | Refined Medical Aesthetics',
            'metafields_global_description_tag': 'Shop WBco retail and clinic-approved homecare from Refined Medical Aesthetics. Nurse-led skincare support from Seaton Delaval.'
        }
    })
    report.append('Updated WBco page SEO/content')

    collection_html = (
        '<p>Refined Medical Aesthetics has selected this collection of medical grade skincare and homecare essentials to support healthy skin at home and protect your results between appointments. Every product is chosen with a nurse-led, clinic-first mindset, focusing on practical products that are gentle, effective, and easy to use consistently.</p>'
        '<p>Whether you are looking for a cleanser, hydration support, blemish care, or simple maintenance between appointments, this collection is designed to help you keep your routine clear and manageable.</p>'
        '<h2>Frequently asked questions</h2>'
        '<p><strong>What does medical grade skincare mean?</strong><br>Medical grade skincare is typically formulated with high-quality active ingredients and chosen to support skin health with a more results-focused approach than basic over-the-counter products.</p>'
        '<p><strong>Are these products suitable after treatment?</strong><br>Some products may work well as part of a post-treatment routine, but suitability depends on the treatment and your skin. If unsure, contact the clinic before ordering.</p>'
        '<p><strong>Can I get advice before buying?</strong><br>Yes. Refined Medical Aesthetics offers straightforward nurse-led guidance if you are unsure which product best fits your routine.</p>'
    )
    rest('PUT', f'/custom_collections/{collections["medical-grade-essentials"]["id"]}.json', {
        'custom_collection': {
            'id': collections['medical-grade-essentials']['id'],
            'title': 'Medical Grade Essentials',
            'body_html': collection_html,
            'metafields_global_title_tag': 'Medical Grade Skincare | Clinic-Recommended Homecare | Refined Medical Aesthetics',
            'metafields_global_description_tag': 'Shop clinic-recommended medical grade skincare and homecare essentials selected by Refined Medical Aesthetics. Nurse-led product picks for calm, healthy, well-supported skin.'
        }
    })
    report.append('Updated Medical Grade Essentials collection SEO/content')


def update_menus(report):
    q = '{ menus(first:10){nodes{id handle title items{title type resourceId}} } }'
    menus = graphql(q)['data']['menus']['nodes']
    menu_by_handle = {m['handle']: m for m in menus}
    pages = {p['handle']: p['admin_graphql_api_id'] for p in rest('GET', '/pages.json?limit=250')['pages']}
    cols = {c['handle']: c['admin_graphql_api_id'] for c in rest('GET', '/custom_collections.json?limit=250')['custom_collections']}
    mutation = '''
    mutation menuUpdate($id: ID!, $title: String!, $handle: String!, $items: [MenuItemUpdateInput!]!) {
      menuUpdate(id: $id, title: $title, handle: $handle, items: $items) {
        userErrors { field message }
      }
    }
    '''
    footer_items = [
        {'title': 'Medical Grade Essentials', 'type': 'COLLECTION', 'resourceId': cols['medical-grade-essentials']},
        {'title': 'Shipping & Returns', 'type': 'PAGE', 'resourceId': pages['shipping-and-returns']},
        {'title': 'Contact', 'type': 'PAGE', 'resourceId': pages['contact']},
        {'title': 'About Nurse Rachel', 'type': 'PAGE', 'resourceId': pages['about-refined']},
    ]
    res = graphql(mutation, {'id': menu_by_handle['footer']['id'], 'title': 'Footer menu', 'handle': 'footer', 'items': footer_items})
    errs = res['data']['menuUpdate']['userErrors']
    if errs:
        raise RuntimeError(f'Menu update failed: {errs}')
    report.append('Updated footer menu labels/links')


def update_theme(report):
    themes = rest('GET', '/themes.json')['themes']
    theme_ids = [t['id'] for t in themes]
    for theme_id in theme_ids:
        meta_tags = get_asset(theme_id, 'snippets/meta-tags.liquid')
        if 'refined-home-seo-start' not in meta_tags:
            inject = '''\n{%- comment -%} refined-home-seo-start {%- endcomment -%}\n{%- if request.page_type == 'index' -%}\n  {%- assign og_title = 'Medical Grade Skincare | Refined Medical Aesthetics' -%}\n  {%- assign og_description = 'Shop nurse-led medical grade skincare and WBco essentials from Refined Medical Aesthetics. Clinic-approved homecare, trusted routines, and skincare support from Seaton Delaval.' -%}\n{%- endif -%}\n{%- comment -%} refined-home-seo-end {%- endcomment -%}\n'''
            meta_tags = meta_tags.replace("{%- if page_image -%}", inject + "\n{%- if page_image -%}")
            meta_tags = meta_tags.replace("<title>\n  {{ page_title }}", "<title>\n  {% if request.page_type == 'index' %}Medical Grade Skincare{% else %}{{ page_title }}{% endif %}")
            meta_tags = meta_tags.replace("{% if page_description %}\n  <meta\n    name=\"description\"\n    content=\"{{ page_description | escape }}\"\n  >\n{% endif %}", "<meta\n  name=\"description\"\n  content=\"{% if request.page_type == 'index' %}Shop nurse-led medical grade skincare and WBco essentials from Refined Medical Aesthetics. Clinic-approved homecare, trusted routines, and skincare support from Seaton Delaval.{% elsif page_description %}{{ page_description | escape }}{% else %}{{ shop.description | escape }}{% endif %}\"\n>")
            put_asset(theme_id, 'snippets/meta-tags.liquid', meta_tags)
        theme_liquid = get_asset(theme_id, 'layout/theme.liquid')
        if GA4_ID not in theme_liquid:
            ga = f"\n    <!-- Refined GA4 -->\n    <script async src=\"https://www.googletagmanager.com/gtag/js?id={GA4_ID}\"></script>\n    <script>\n      window.dataLayer = window.dataLayer || [];\n      function gtag(){{dataLayer.push(arguments);}}\n      gtag('js', new Date());\n      gtag('config', '{GA4_ID}');\n    </script>\n"
            theme_liquid = theme_liquid.replace('{{ content_for_header }}', '{{ content_for_header }}' + ga)
            put_asset(theme_id, 'layout/theme.liquid', theme_liquid)
        settings_data = json.loads(get_asset(theme_id, 'config/settings_data.json'))
        current = settings_data['current']
        current['announcement_cXDVCA:text'] = current.get('announcement_cXDVCA:text', '')
        idx = json.loads(get_asset(theme_id, 'templates/index.json'))
        hero = idx['sections']['hero_p9CmMG']
        hero['settings']['media_type_1'] = 'image'
        hero['settings']['image_1'] = 'shopify://shop_images/rachel-hero-new.jpg'
        hero['settings']['media_type_2'] = 'none'
        hero['settings']['image_2'] = ''
        hero['settings']['horizontal_alignment'] = 'flex-start'
        hero['settings']['horizontal_alignment_flex_direction_column'] = 'flex-start'
        hero['settings']['vertical_alignment'] = 'end'
        hero['blocks']['group_6w9b3Y']['settings']['horizontal_alignment'] = 'flex-start'
        hero['blocks']['group_6w9b3Y']['settings']['horizontal_alignment_flex_direction_column'] = 'flex-start'
        hero['blocks']['group_6w9b3Y']['blocks']['group_9wtdTw']['blocks']['text_qHY3XF']['settings']['text'] = '<p><strong>Medical grade skincare</strong></p><h1>Nurse-led homecare by Refined Medical Aesthetics</h1>'
        hero['blocks']['group_6w9b3Y']['blocks']['group_cchkdt']['blocks']['text_WbGw7w']['settings']['text'] = '<p>Shop clinic-approved skincare, hydration support, and WBco essentials selected by Nurse Rachel in Seaton Delaval.</p>'
        idx['sections']['product_list_themegen']['blocks']['static-header']['blocks']['product_list_text_Bd9pVh']['settings']['text'] = '<h2>Clinic-selected essentials</h2><p>Simple, trusted products chosen to support skin health at home.</p>'
        idx['sections']['section_refined_wbco_20260321']['blocks']['text_pH8qby']['settings']['text'] = '<h2>Medical grade skincare and WBco favourites</h2>'
        idx['sections']['section_refined_wbco_20260321']['blocks']['text_eFMntb']['settings']['text'] = '<p>Support your treatment results with nurse-led homecare, hydration support, and everyday essentials that fit real life.</p>'
        idx['sections']['section_refined_wbco_20260321']['blocks']['button_TmU98M']['settings']['label'] = 'Shop medical grade skincare'
        idx['sections']['media_with_content_xMM9EF']['blocks']['content']['blocks']['text_tgFN9e']['settings']['text'] = '<h2>Meet Nurse Rachel</h2>'
        idx['sections']['media_with_content_xMM9EF']['blocks']['content']['blocks']['text_HqcftD']['settings']['text'] = '<p>Refined Medical Aesthetics is led by Rachel, an NHS paediatric nurse and aesthetics practitioner focused on calm, professional care, subtle results, and honest advice.</p>'
        idx['sections']['media_with_content_xMM9EF']['blocks']['content']['blocks']['button_dDjrqQ']['settings']['label'] = 'About Nurse Rachel'
        idx['sections']['media_with_content_refined_20260321']['blocks']['content']['blocks']['text_4BbAqH']['settings']['text'] = '<h2>Homecare that protects your results</h2>'
        idx['sections']['media_with_content_refined_20260321']['blocks']['content']['blocks']['text_tKc49J']['settings']['text'] = '<p>Keep skin calm and supported between appointments with gentle cleansers, hydration essentials, and practical products selected for real routines.</p>'
        idx['sections']['media_with_content_refined_20260321']['blocks']['content']['blocks']['button_AP3RH4']['settings']['label'] = 'Browse medical grade essentials'
        put_asset(theme_id, 'templates/index.json', json.dumps(idx, indent=2))

        header_group = json.loads(get_asset(theme_id, 'sections/header-group.json'))
        header_group['sections']['header_announcements_QTBwtW']['blocks']['announcement_cXDVCA']['settings']['text'] = 'Nurse-led medical grade skincare and clinic favourites'
        put_asset(theme_id, 'sections/header-group.json', json.dumps(header_group, indent=2))
    report.append('Updated homepage content, home SEO override, announcement bar, and GA4 in theme assets')


def main():
    report = []
    update_products(report)
    update_pages_and_collections(report)
    update_menus(report)
    update_theme(report)
    output = {
        'shop': SHOP,
        'ga4': GA4_ID,
        'actions': report,
    }
    out = Path('/data/.openclaw/workspace/refinedmedicalaestheticsuk/SHOPIFY_IMPLEMENTATION_REPORT.json')
    out.write_text(json.dumps(output, indent=2))
    print(json.dumps(output, indent=2))


if __name__ == '__main__':
    main()
