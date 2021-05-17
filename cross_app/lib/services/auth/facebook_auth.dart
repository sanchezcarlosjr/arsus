import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_facebook_auth/flutter_facebook_auth.dart';
import 'auth_util.dart';

Future<User> signInWithFacebook(BuildContext context) async {
  final signInFunc = () async {
    final AccessToken result = await FacebookAuth.instance.login();
    final facebookAuthCredential = FacebookAuthProvider.credential(result.token);
    return FirebaseAuth.instance.signInWithCredential(facebookAuthCredential);
  };
  return signInOrCreateAccount(context, signInFunc);
}

