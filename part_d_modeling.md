# Unit 3 - Part D: Data Modeling Justification

## 1. Justification of Data Modeling Choices

### A. Why Profile is Embedded in `students`
- **Bounded Growth:** A student profile (skills, social links, city) contains a finite set of key-value pairs that will not grow infinitely.
- **Access Pattern:** Profile details belong exclusively to one student and are retrieved together with the student document.
- **Update Frequency:** Profile changes are rare, so embedding avoids unnecessarily complex `$lookup` operations.

### B. Why `courseId` is Referenced in `students`
- **Shared Data:** A course is shared across many enrolled students.
- **Update Frequency & Data Integrity:** If course details (like title or credits) change, modifying a single document in the `courses` collection immediately updates the state across the entire application without needing to update thousands of duplicated embedded copies inside student documents.

---

## 2. Impact of Schema Change (Centrally Shared Course Updates)

If the college updates a course's credit value centrally for everyone enrolled:
- **Referenced Design (Our Choice):** **Easy.** We update a single course document in the `courses` collection.
- **Embedded Design:** **Hard.** We would have to perform a costly `updateMany()` operation across every student document to replace duplicate embedded course information, introducing risk of inconsistency.

---

## 3. Course Reviews Implementation Justification

**Choice:** Embedded array inside the `courses` collection.
**Defense:** Course reviews are accessed directly when viewing a specific course page. Capping the maximum number of recent reviews embedded per course avoids performance overhead while saving secondary database lookups.