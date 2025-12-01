
# VCard

A vCard 3.0 Webflow Code Component.

Accepts basic vcard3 fields as properties

Presents a button; when the button is clicked, the vcard information is downloaded.
Since there is no file, we need to achieve this by manufacturing a link containing the Vcard file encoded.

No image support needed.

## Component Requirements

### Properties

**Variant:**
- **Type** (Variant) - Options: "Button", "Slot" - Default: "Button"
  - Button: Renders a built-in styled button
  - Slot: Allows user to provide custom content that triggers download

**Button Variant Properties:**
- **Button Text** (Text) - Default: "Save to Contacts"
- **Button Style** (Text) - Custom CSS styles (e.g., "background-color: red; color: white;")

**Slot Variant Properties:**
- **Content** (Slot) - Custom content to trigger vCard download

**File:**
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

When clicked (either button or slot content), the component generates a vCard 3.0 formatted file with all provided fields and triggers a download.

## Implementation Details

### Slot Variant Click Handling

The Slot variant uses a clever technique to intercept clicks on user-provided content:

1. **Wrapper Structure**: The slot content is wrapped in two divs:
   ```tsx
   <div onClick={handleDownload} style={{ cursor: 'pointer', display: 'inline-block' }}>
     <div style={{ pointerEvents: 'none' }}>
       {Slot}
     </div>
   </div>
   ```

2. **Pointer Events Disabled**: The inner wrapper has `pointerEvents: 'none'`, which disables all mouse/touch interactions on the slotted content itself (buttons, links, etc.).

3. **Click Capture**: Since the slotted content can't receive pointer events, all clicks bubble up to the parent div, which captures them and triggers the vCard download.

4. **Event Handling**: The parent div's onClick handler:
   - Prevents default behavior (`e.preventDefault()`)
   - Stops event propagation (`e.stopPropagation()`)
   - Triggers the vCard download

This approach allows users to insert any styled content (buttons, links, images) into the slot, and clicking anywhere on that content will trigger the download without needing to modify the slotted elements.

### Button Variant Styling

The Button variant supports custom CSS through the **Button Style** property:

1. **CSS String Parsing**: Accepts inline CSS as a string (e.g., `"background-color: red; font-size: 18px;"`)

2. **Property Conversion**: Automatically converts kebab-case CSS properties to camelCase for React (e.g., `background-color` → `backgroundColor`)

3. **Style Merging**: Custom styles are merged with default button styles, allowing users to override specific properties while keeping sensible defaults

4. **Default Styles**:
   - padding: 12px 24px
   - fontSize: 16px
   - cursor: pointer
   - backgroundColor: #0073e6
   - color: #ffffff
   - border: none
   - borderRadius: 4px



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



