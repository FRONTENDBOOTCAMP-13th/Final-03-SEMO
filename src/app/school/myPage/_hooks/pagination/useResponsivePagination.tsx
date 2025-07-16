import { useState, useMemo, useEffect, useCallback } from "react";

interface UseResponsivePaginationProps<T> {
  data: T[];
  estimatedItemHeight?: number;
  minItemsPerPage?: number;
  maxItemsPerPage?: number;
  initialPage?: number;
  reservedHeight?: number;
}

interface PageChangeEvent {
  selected: number;
}
