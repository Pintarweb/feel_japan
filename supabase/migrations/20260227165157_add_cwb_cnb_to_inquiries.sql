ALTER TABLE public.inquiries RENAME COLUMN children_6_11 TO children_cwb;
ALTER TABLE public.inquiries ADD COLUMN children_cnb integer null default 0;
ALTER TABLE public.inquiries RENAME COLUMN infants_under_6 TO infants_0_2;
