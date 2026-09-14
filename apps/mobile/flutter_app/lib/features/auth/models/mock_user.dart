enum UserRole { student, facultyOrStaff, admin }

class MockUser {
  const MockUser({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.role = UserRole.student,
  });

  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final UserRole role;

  String get displayName => '$firstName $lastName';
  String get initial => firstName.isEmpty ? '?' : firstName[0].toUpperCase();
  String get roleLabel {
    return switch (role) {
      UserRole.student => 'Student',
      UserRole.facultyOrStaff => 'Faculty/Staff',
      UserRole.admin => 'Admin',
    };
  }
}