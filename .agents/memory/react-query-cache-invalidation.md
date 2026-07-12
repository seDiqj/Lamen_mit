---
name: React Query cache invalidation gotcha
description: Why some pages showed stale data after mutations, and the query-key rule that fixes it project-wide.
---

# React Query cache invalidation

The app's `client/src/lib/queryClient.ts` sets `staleTime: Infinity`, `refetchOnWindowFocus: false`, `refetchInterval: false`. So a query NEVER refetches on its own — it only updates when something explicitly calls `invalidateQueries`.

`invalidateQueries({ queryKey: ["/api/foo"] })` matches by **prefix, element-by-element**. A query whose key is a single combined string like `["/api/foo?page=1&limit=2000"]` will NOT be matched by `["/api/foo"]` because the first array elements differ. Such a query becomes permanently stale after any mutation.

**Rule:** always structure query keys as segmented arrays with the base path as the first element, e.g. `["/api/foo", "some-variant"]` or `["/api/foo", id]`. Then invalidating `["/api/foo"]` refreshes them. The default fetcher builds the URL via `queryKey.join("/")`, so if a segment must not become part of the URL, supply an explicit `queryFn`.

**Why:** the payments Summary tab + Excel export showed stale repaid amounts/percentages after recording payments, while the Details dialog (a separate per-loan query) was correct — the summary's single-string key was never invalidated.

**How to apply:** when a page shows stale data after a mutation elsewhere, check that its query key is a prefix-matchable array, not one combined string, and that the mutation's `invalidateQueries` uses the shared base-path prefix.
