import {
  ColumnDef,
  ColumnResizeMode,
  flexRender,
  RowData,
  SortingState,
  Table,
} from "@tanstack/react-table";
import { CSSProperties } from "react";

interface TTTableLayoutProps {
  sticky?: boolean;
  condensed?: boolean;
  bordered?: boolean;
  verticalLines?: boolean;
  sortable?: boolean;
  globalFilter?: boolean;
  footer?: boolean;
  selectable?: boolean;
  resizable?: boolean;
  expandable?: boolean;
  filterColumns?: boolean;
  filterGlobal?: boolean;
  striped?: boolean;
  pagination?:
    | {
        defaultPageSize: number;
        pageSizeOptions: number[];
      }
    | boolean;
  cx?: {
    baseBgColor?: string;
    baseTextColor?: string;
    table?: {
      root?: string;
      wrapper?: string;
    };
    header?: {
      cell?: string;
      row?: string;
      root?: string;
    };
    body?: {
      cell?: string;
      row?: string;
      striped?: string;
      root?: string;
    };
    footer?: {
      cell?: string;
      row?: string;
      root?: string;
    };
    pagination?: {
      navigationButtons?: string;
    };
  };
  sx?: {
    table?: {
      root?: CSSProperties;
      wrapper?: CSSProperties;
    };
    header?: {
      cell?: CSSProperties;
      row?: CSSProperties;
      root?: CSSProperties;
    };
    body?: {
      cell?: CSSProperties;
      row?: CSSProperties;
      striped?: CSSProperties;
      root?: CSSProperties;
    };
    footer?: {
      cell?: CSSProperties;
      row?: CSSProperties;
      root?: CSSProperties;
    };
    pagination?: {
      navigationButtons?: CSSProperties;
    };
  };
}

interface TTTableProps<Tdata extends RowData> extends TTTableLayoutProps {
  inputData: Tdata[];
  inputColumns?: ColumnDef<Tdata>[];
  defaultColumn?: Partial<ColumnDef<Tdata>>;
}

interface TTTableState<Tdata extends RowData> {
  table: Table<Tdata>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  columnResizeMode: ColumnResizeMode;
  setColumnResizeMode: React.Dispatch<React.SetStateAction<ColumnResizeMode>>;
  data: Tdata[];
  setData: React.Dispatch<React.SetStateAction<Tdata[]>>;
  columns: ColumnDef<Tdata, unknown>[];
  flexRender: typeof flexRender;
}

export type { TTTableProps, TTTableLayoutProps, TTTableState };
