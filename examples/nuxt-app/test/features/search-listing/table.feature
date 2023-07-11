Feature: Search listing table layout

  I can see a collection of results displayed in a tabular form

  Background:
    Given the endpoint "/api/tide/site" with query "?id=8888" returns fixture "/site/reference" with status 200
    And I am using a "macbook-16" device

  @mockserver
  Example: Grants
    Given the endpoint "/api/tide/page" with query "?path=/search-listing-table&site=8888" returns fixture "/search-listing/table/page" with status 200
    And the search network request is stubbed with fixture "/search-listing/table/response" and status 200
    When I visit the page "/search-listing-table"
    And the search network request should be called with the "/search-listing/table/request" fixture
    And the search listing layout should be "table"

# Then the search listing page should have 2 results
# And the grant search listing results should have following items:
#   | title                                | url                                           | updated                            | content                                                                                                                                            | audience                          | amount            | status                    |
#   | THIS IS A TEST                       | /site-8888/tc-9b-grant-page-closed            | Updated: 2023-05-09T15:00:46+10:00 | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt sit amet ligula sit amet lacinia. In a leo nec tortor aliquet faucibus. | Business                          | $11,326 - $26,494 | Closed                    |
#   | TC-9a Grant Simple Test - Date Range | /site-8888/tc-9a-grant-simple-test-date-range | Updated: 2023-05-09T15:00:46+10:00 | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt sit amet ligula sit amet lacinia. In a leo nec tortor aliquet faucibus. | Not-for-profit groups, government | $11,326 - $26,494 | Open, closing in 163 days |
# When I click the search listing dropdown field labelled "View those relevant to me"
# # First item is hardcoded, the rest come from ES aggregation
# Then the selected dropdown field should have the items:
#   | Hard coded            |
#   | Business              |
#   | Government            |
#   | Individual            |
#   | Not-for-profit groups |
# When I click the search listing dropdown field labelled "Grant or program topic"
# # These come from Tide page API response
# Then the selected dropdown field should have the items:
#   | Arts     |
#   | Business |
