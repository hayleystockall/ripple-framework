import { IRplAnalyticsEventPayload } from './tracker'
import { getBreadcrumbs } from '#imports'

const trimValue = (value: any) =>
  typeof value === 'string' ? value.trim() : value

export default function ({ route, site, page }): IRplAnalyticsEventPayload {
  const payload: IRplAnalyticsEventPayload = {
    event: 'routeChange',
    name: page?.title,
    page_url: route.fullPath,
    content_type: page?.type,
    publication_name: page?.publication?.text,
    search_term: trimValue(route.query?.q),
    site_section: page?.siteSection?.name,
    production: process.env.NODE_ENV === 'production',
    platform_event: 'page/routeChange'
  }

  const pageBreadcrumbs = page?.breadcrumbs
    ? page?.breadcrumbs
    : getBreadcrumbs(route.fullPath, page?.title, site?.menus?.menuMain)

  if (Array.isArray(pageBreadcrumbs)) {
    payload.breadcrumbs = pageBreadcrumbs
      .filter((crumb) => crumb?.url !== '/')
      .map((crumb) => crumb.text)
  }

  const measurementIds = {
    uat_measurement_id: site?.featureFlags?.uatMeasurementID,
    prod_measurement_id: site?.featureFlags?.prodMeasurementID
  }

  if (Object.values(measurementIds).filter(Boolean).length) {
    payload.google_analytics = measurementIds
  }

  return payload
}
