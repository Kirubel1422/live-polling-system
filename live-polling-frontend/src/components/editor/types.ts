import { Slide } from "@/types/presentation";

// From SlideCanvas.tsx
export type ThumbnailSize = false | "list" | "card";

export interface SlideCanvasProps {
  slide: Slide | undefined;
  presentationId: string;
}

export interface ContentComponentProps<T extends Slide> {
  slide: T;
  thumbnailSize?: ThumbnailSize;
}

// From RightPanel.tsx
export interface RightPanelProps {
  slide: Slide;
  presentationId: string;
}

export interface BaseTabProps {
  slide: Slide;
  onUpdate: (updates: Partial<Slide>) => void;
}

export interface ContentTabProps extends BaseTabProps {
  presentationId: string;
}

export type DesignTabProps = BaseTabProps;
export type SettingsTabProps = BaseTabProps;

// From AddSlideMenu.tsx
export interface AddSlideMenuProps {
  presentationId: string;
}

// From SlideList.tsx
export interface SlideListProps {
  slides: Slide[];
  selectedSlideId: string | null;
  presentationId: string;
}

// From SlideThumbnail.tsx
export interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  presentationId: string;
}
