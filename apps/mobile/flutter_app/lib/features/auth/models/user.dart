enum UserRole { student, faculty, staff, admin }

UserRole userRoleFromString(String role) {
  return switch (role) {
    'admin' => UserRole.admin,
    'faculty' => UserRole.faculty,
    'staff' => UserRole.staff,
    _ => UserRole.student,
  };
}

class User {
  const User({
    required this.id,
    required this.email,
    required this.role,
    this.fullName,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      role: userRoleFromString(json['role']?.toString() ?? 'student'),
      fullName: json['fullName']?.toString(),
    );
  }

  final String id;
  final String email;
  final UserRole role;
  final String? fullName;

  String get displayName {
    if (fullName != null && fullName!.trim().isNotEmpty) return fullName!;
    final prefix = email.split('@').first;
    if (prefix.isEmpty) return 'Student';
    return prefix
        .split(RegExp(r'[._]'))
        .map((part) {
          if (part.isEmpty) return part;
          return part[0].toUpperCase() + part.substring(1);
        })
        .join(' ');
  }

  String get initial => displayName.isEmpty ? '?' : displayName[0].toUpperCase();

  String get roleLabel {
    return switch (role) {
      UserRole.student => 'Student',
      UserRole.faculty => 'Faculty',
      UserRole.staff => 'Staff',
      UserRole.admin => 'Admin',
    };
  }
}