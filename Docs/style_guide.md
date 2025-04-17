# RadOrderPad Style Guide

## Color Palette

### Primary Colors
- **Primary Blue**: `hsl(222.2 47.4% 30%)` - Used for the main brand color, buttons, and highlighting active elements
- **Background**: `#f9fafb` (gray-50) - Light gray used for page backgrounds
- **White**: `#ffffff` - Used for card backgrounds and content areas
- **Text (Foreground)**: `hsl(20 14.3% 4.1%)` - Dark gray for main text content

### Secondary Colors
- **Gray-200**: `#e5e7eb` - Used for borders and separators
- **Gray-500**: `#6b7280` - Used for icons and secondary text
- **Secondary**: `hsl(60 4.8% 95.9%)` - Used for secondary buttons and highlights

## Login Page Specific Colors
- **Background**: `bg-gray-50` (`#f9fafb`) - Light gray background
- **Card Background**: White (`#ffffff`)
- **Logo Color**: Primary Blue (`hsl(222.2 47.4% 30%)`)
- **Input Fields**: 
  - Border: Gray-200 (`#e5e7eb`)
  - Focus border: Primary Blue
  - Icon color: Gray-500 (`#6b7280`)
- **Login Button**: 
  - Background: Primary Blue
  - Text: White
- **Form Text**:
  - Labels: Dark gray (`hsl(20 14.3% 4.1%)`)
  - Descriptions: Gray-500 (`#6b7280`)

## Navigation Bar (Post-Login)
- **Background**: White (`#ffffff`)
- **Border Bottom**: Gray-200 (`#e5e7eb`)
- **Logo Text**: Primary Blue
- **Navigation Links**:
  - Default: Text color Dark Gray
  - Active/Selected: Border bottom Primary Blue, Background light gray (hsl(60 4.8% 95.9%))
- **User Menu**:
  - Avatar Background: Primary Blue
  - Avatar Text: White
  - Dropdown Background: White
  - Dropdown Border: Gray-200

## Typography
- **Font Family**: Inter (Primary font)
- **Font Weights**:
  - Regular (400): Default text
  - Medium (500): Navigation links, form labels
  - Semibold (600): Button text, headers
  - Bold (700): Page titles, logo

## Component Styling

### Buttons
- **Primary Button**:
  - Background: Primary Blue
  - Text: White
  - Hover: Slightly darker blue
  - Border radius: 0.5rem (controlled by `--radius` variable)

### Cards
- **Default Card**:
  - Background: White
  - Border: Gray-200
  - Shadow: Light shadow (`shadow-sm`)
  - Border radius: Follows design system radius variables

### Navigation
- **Desktop Navigation**:
  - Height: 4rem (h-16)
  - Items spacing: 1rem (space-x-4)
  - Active indicator: 2px border bottom in Primary Blue