import 'package:arsus/views/pages/home_page/new_card_component.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/widgets.dart';

class NewsComponent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance.collection('content').orderBy("created_at").limitToLast(5).snapshots(),
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (snapshot.hasError) {
          return Text('Something went wrong');
        }
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Text("Loading...");
        }
        return new ListView(
          children: snapshot.data.docs.map((DocumentSnapshot document) => NewCardWidget(data: document.data())).toList(),
        );
      },
    );
  }
}
