/**
 * Consolidated style utilities for consistent theming
 */

// Button styles
export const buttonStyles = {
  primary: "w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all text-lg flex items-center justify-center",
  primaryDisabled: "disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed",
  secondary: "text-green-600 font-medium flex items-center p-0",
  navigation: "justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10"
};

// Card styles
export const cardStyles = {
  primary: "bg-white border-2 border-green-200 rounded-xl",
  hover: "hover:bg-green-50 transition-colors",
  gradient: "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg"
};

// Text colors
export const textColors = {
  primary: "text-green-600",
  primaryHover: "hover:text-green-800",
  secondary: "text-green-700",
  light: "text-green-100",
  lighter: "text-green-200",
  success: "text-green-600",
  error: "text-red-600"
};

// Icon colors
export const iconColors = {
  primary: "text-green-600",
  secondary: "text-green-700",
  light: "text-green-200",
  lighter: "text-green-400"
};

// Background colors
export const backgroundColors = {
  primary: "bg-green-600",
  secondary: "bg-green-100",
  light: "bg-green-50",
  hover: "hover:bg-green-50"
};

// Quick action button style
export const quickActionButton = "bg-white border-2 border-green-200 rounded-xl p-4 text-center hover:bg-green-50 transition-colors group h-auto flex-col";

// Header gradient
export const headerGradient = "bg-gradient-to-r from-green-600 to-green-700";

// Utility function to combine styles
export const combineStyles = (...styles: string[]) => styles.join(' ');

// Common component combinations
export const commonStyles = {
  primaryButton: combineStyles(buttonStyles.primary, buttonStyles.primaryDisabled),
  cardWithHover: combineStyles(cardStyles.primary, cardStyles.hover),
  navigationButton: combineStyles(buttonStyles.navigation, textColors.primary)
};