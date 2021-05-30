import 'package:cloud_firestore/cloud_firestore.dart';

class FirestorePaginationCreator {
  Future<List<DocumentSnapshot>> fetchFirstList() async {
    return (await FirebaseFirestore.instance
        .collection("content")
        .orderBy("created_at", descending: true)
        .limit(5)
        .get())
        .docs;
  }

  Future<List<DocumentSnapshot>> fetchNextList(List<DocumentSnapshot> documentList) async {
    return (await FirebaseFirestore.instance
        .collection("content")
        .orderBy("created_at", descending: true)
        .startAfterDocument(documentList[documentList.length - 1])
        .limit(5)
        .get())
        .docs;
  }
}
