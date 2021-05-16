import 'package:firebase_auth/firebase_auth.dart';
import 'package:rxdart/rxdart.dart';

class ArsusFirebaseUser {
  ArsusFirebaseUser(this.user);
  final User user;
  bool get loggedIn => user != null;
}

ArsusFirebaseUser currentUser;
bool get loggedIn => currentUser?.loggedIn ?? false;
Stream<ArsusFirebaseUser> arsusFirebaseUserStream() => FirebaseAuth.instance
    .authStateChanges()
    .debounce((user) => user == null && !loggedIn
        ? TimerStream(true, const Duration(seconds: 1))
        : Stream.value(user))
    .map<ArsusFirebaseUser>((user) => currentUser = ArsusFirebaseUser(user));
