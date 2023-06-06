---
title: Breadcrumb
description: A breadcrumb shows users their location on a website. This allows quick navigation between page levels.
layout: page
label: Core

---

## Usage

A breadcrumb is a series of links and icons in a line. This helps users understand where they are within a website’s structure. 

A breadcrumb displays the parent page, icons and the current page.

- Parent page: This links to the page above the current page in the information architecture (IA).
- Icon: Chevrons between the parent and current pages designed to visualise page hierarchy.
- Current page: This is the page the user is currently on.

::DocsExample
---
id: core-navigation-breadcrumbs--default-story
---
::

### When and how to use
- Display the Breadcrumb at the top left of a page, below the main navigation but above the page title
- Always start the Breadcrumb with the parent page
- Always end the Breadcrumb with the current page
- Truncate longer names if you've reached the maximum amount of links

### When and how not to use
- The Breadcrumb does not replace primary navigation
- Do not use the Breadcrumb to show progress through a linear journey

---

## How the Breadcrumb works

On devices with a page resolution under 768px, the Breadcrumb displays the parent link only.

---

## Theming

The Breadcrumb uses colour to: 

- represent possible interactions 
- interactive states.

::DocsThemeChooser
  ::DocsExample
  ---
  id: core-navigation-breadcrumbs--default-story
  ---
  ::
::

To create your own theme, see [theming guidance for designers](https://www.vic.gov.au) or [theming guidance for developers](https://www.vic.gov.au).