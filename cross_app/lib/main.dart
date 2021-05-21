import 'package:arsus/views/apps/ine_page/ine_page_widget.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'services/auth/firebase_user_provider.dart';
import 'package:arsus/views/pages/home_page/home_page.dart';
import 'package:arsus/views/apps/apps_page_widget.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  // This widget is the root of your application.
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  Stream<ArsusFirebaseUser> userStream;
  ArsusFirebaseUser initialUser;

  @override
  void initState() {
    super.initState();
    userStream = arsusFirebaseUserStream()
      ..listen((user) => initialUser ?? setState(() => initialUser = user));
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Arsus',
      theme: ThemeData(primarySwatch: Colors.green),
      routes: {
        '/': (context) => HomePageWidget(),
        '/apps/ine-validator': (context) => InePageWidget(),
        '/apps': (context) => AppsPageWidget()
      },
      initialRoute: initialUser != null && currentUser.loggedIn ? "/apps" : "/"
    );
  }
}
