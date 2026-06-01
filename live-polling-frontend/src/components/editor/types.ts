import { type Slide } from "@/types/presentation";

// From SlideCanvas.tsx
export type ThumbnailSize = false | "list" | "card";

export interface SlideCanvasProps {
  slide: Slide | undefined;
  presentationId: string;
  isPreview: boolean;
  responses: any[];
}

export interface ContentComponentProps<T extends Slide> {
  slide: T;
  thumbnailSize?: ThumbnailSize;
}

// From RightPanel.tsx
export interface RightPanelProps {
  slide: Slide;
  presentationId: string;
  isTemplatePreview?: boolean;
}

export interface BaseTabProps {
  slide: Slide;
  onUpdate: (updates: Partial<Slide>) => void;
}

export interface ContentTabProps extends BaseTabProps {
  presentationId: string;
}

export interface DesignTabProps extends BaseTabProps {
  presentationId: string;
}
export interface SettingsTabProps extends BaseTabProps {
  presentationId: string;
  slideId: string;
  isTemplatePreview?: boolean;
}

// From AddSlideMenu.tsx
export interface AddSlideMenuProps {
  presentationId: string;
}

// From SlideList.tsx
export interface SlideListProps {
  slides: Slide[];
  selectedSlideId: string | null;
  presentationId: string;
  isTemplatePreview?: boolean;
}

// From SlideThumbnail.tsx
export interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  presentationId: string;
  isTemplatePreview?: boolean;
}
