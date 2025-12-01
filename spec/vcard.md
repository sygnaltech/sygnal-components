
# VCard

A vCard 3.0 Webflow Code Component.

Accepts basic vcard3 fields as properties

Presents a button; when the button is clicked, the vcard information is downloaded.
Since there is no file, we need to achieve this by manufacturing a link containing the Vcard file encoded.

No image support needed.

## Component Requirements

### Properties

**Button & File:**
- **Button Text** (Text) - Default: "Save to Contacts"
- **Filename** (Text) - Default: "contact.vcf" (automatically append .vcf if missing)

**Contact Information (all optional):**
- **Full Name** (Text) - FN field
- **Last Name** (Text) - N field, first part
- **First Name** (Text) - N field, second part
- **Organization** (Text) - ORG field
- **Title** (Text) - TITLE field
- **Cell Phone** (Text) - TEL;TYPE=CELL
- **Work Phone** (Text) - TEL;TYPE=WORK,VOICE
- **Email** (Text) - EMAIL;TYPE=WORK
- **Additional Email** (Text) - Second EMAIL field
- **Street Address** (Text) - ADR;TYPE=WORK (street)
- **City** (Text) - ADR;TYPE=WORK (city)
- **Postal Code** (Text) - ADR;TYPE=WORK (postal code)
- **Country** (Text) - ADR;TYPE=WORK (country)
- **Website URL** (Text) - URL field
- **Note** (Text) - NOTE field

### Behavior

When clicked, the button generates a vCard 3.0 formatted file with all provided fields and triggers a download.



## Additional Notes for Future Reference 

## vCard 3.0

vCard 3.0 (Standard, Most Compatible — iOS + Android + Desktop)

```
BEGIN:VCARD
VERSION:3.0
N:Doe;Alex;;;
FN:Alex Doe
ORG:Sygnal Test Corp
TITLE:Product Manager
TEL;TYPE=CELL:+1-555-284-9921
TEL;TYPE=WORK,VOICE:+1-555-110-4477
EMAIL;TYPE=WORK:alex.doe@example.com
ADR;TYPE=WORK:;;123 Market Street;Auckland;;1010;New Zealand
URL:https://example.com
NOTE:Sample contact record for testing vCard handling.
END:VCARD
```

vCard 4.0 (Modern Format — Android fully supports; iOS partially)

```
BEGIN:VCARD
VERSION:4.0
N:Doe;Alex;;;
FN:Alex Doe
ORG:Sygnal Test Corp
TITLE:Product Manager
TEL;TYPE=cell,voice:+1-555-284-9921
TEL;TYPE=work,voice:+1-555-110-4477
EMAIL;TYPE=work:alex.doe@example.com
ADR;TYPE=work:;;123 Market Street;Auckland;;1010;New Zealand
URL:https://example.com
NOTE:Sample contact record for testing vCard handling.
END:VCARD
```

3. vCard 3.0 with Embedded Photo (Base64)


```
BEGIN:VCARD
VERSION:3.0
N:Doe;Alex;;;
FN:Alex Doe
ORG:Sygnal Test Corp
TITLE:Product Manager
TEL;TYPE=CELL:+1-555-284-9921
TEL;TYPE=WORK,VOICE:+1-555-110-4477
EMAIL;TYPE=WORK:alex.doe@example.com
ADR;TYPE=WORK:;;123 Market Street;Auckland;;1010;New Zealand
URL:https://example.com
PHOTO;ENCODING=b;TYPE=JPEG:
/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABQODxIPDxQREhUUExgaGBoaHB4jJCQiJiIj
IyszMjMyMzMyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAALCAAyADIBASIA
/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH
/2Q==
NOTE:Sample contact with embedded photo.
END:VCARD
```

4. Minimal Ultra-Compatible vCard (iPhone + Android safest)

```
BEGIN:VCARD
VERSION:3.0
N:Doe;Alex;;;
FN:Alex Doe
TEL;CELL:+1-555-284-9921
EMAIL:alex.doe@example.com
END:VCARD
```



