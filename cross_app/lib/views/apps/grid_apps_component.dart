import 'package:arsus/views/apps/app/App.dart';
import 'package:arsus/views/theme/theme.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class GridApps extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    CollectionReference projects = FirebaseFirestore.instance.collection('projects');
    return StreamBuilder<QuerySnapshot>(
      stream: projects.snapshots(),
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (snapshot.hasError) {
          return Text('Something went wrong');
        }
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Text('');
        }
        return new GridView(
          padding: EdgeInsets.symmetric(horizontal: 10),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 20,
            mainAxisSpacing: 25,
            childAspectRatio: 0.7,
          ),
          scrollDirection: Axis.vertical,
          children: snapshot.data.docs.map((DocumentSnapshot document) => App.factory(document.data())).toList()
        );
      },
    );
  }
}
