import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static ThemeData get light => _base(Brightness.light);
  static ThemeData get dark => _base(Brightness.dark);

  static ThemeData _base(Brightness brightness) {
    final scheme = _colors(brightness);
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      textTheme: GoogleFonts.interTextTheme().apply(
        bodyColor: scheme.onSurface,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: scheme.surface,
        foregroundColor: scheme.onSurface,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        elevation: 1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  static ColorScheme _colors(Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    return ColorScheme(
      brightness: brightness,
      primary: isDark ? const Color(0xFF7C4DFF) : const Color(0xFF5E35B1),
      onPrimary: Colors.white,
      secondary: isDark ? const Color(0xFF64FFDA) : const Color(0xFF00BFA5),
      onSecondary: Colors.black,
      error: isDark ? const Color(0xFFEF9A9A) : const Color(0xFFB00020),
      onError: Colors.white,
      surface: isDark ? const Color(0xFF1C1C1E) : Colors.white,
      onSurface: isDark ? Colors.white : const Color(0xFF1A1A1A),
      surfaceContainerHighest: isDark ? const Color(0xFF2C2C2E) : const Color(0xFFF5F5F5),
      onSurfaceVariant: isDark ? Colors.grey : Colors.grey.shade600,
    );
  }
}