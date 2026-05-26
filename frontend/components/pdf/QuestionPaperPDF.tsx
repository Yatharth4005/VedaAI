import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { QuestionPaper, Question, Section } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  heading: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 2,
  },
  subheading: {
    fontSize: 10,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    paddingHorizontal: 20,
  },
  divider: { borderBottom: "1px solid #E5E7EB", marginVertical: 8 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 2,
    marginTop: 10,
  },
  instruction: {
    fontSize: 9,
    color: "#6B7280",
    fontStyle: "italic",
    marginBottom: 6,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  questionText: { fontSize: 10, flex: 1, lineHeight: 1.5 },
  marksTag: { fontSize: 8, color: "#6B7280" },
  option: { fontSize: 9, color: "#374151", marginLeft: 16, marginBottom: 2 },
  endText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 20,
    fontSize: 9,
  },
  answerHeading: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 8,
  },
  answerRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  answerNum: { fontSize: 10, fontFamily: "Helvetica-Bold", width: 16 },
  answerText: { fontSize: 10, flex: 1, color: "#374151", lineHeight: 1.5 },
});

function PDFQuestion({ q }: { q: Question }) {
  return (
    <View>
      <View style={styles.questionRow}>
        <Text style={styles.questionText}>
          {q.number}. {q.text}
        </Text>
        <Text style={styles.marksTag}>[{q.marks} Marks]</Text>
      </View>
      {q.options?.map((o) => (
        <Text key={o.label} style={styles.option}>
          {o.label}. {o.text}
        </Text>
      ))}
    </View>
  );
}

function PDFSection({ section }: { section: Section }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.instruction}>{section.instruction}</Text>
      <View style={styles.divider} />
      {section.questions.map((q) => (
        <PDFQuestion key={q.number} q={q} />
      ))}
    </View>
  );
}

export function QuestionPaperPDF({ paper }: { paper: QuestionPaper }) {
  const { metadata, sections, answerKey } = paper;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>{metadata.school}</Text>
        <Text style={styles.subheading}>Subject: {metadata.subject}</Text>
        <Text style={styles.subheading}>Class: {metadata.class}</Text>
        <View style={styles.metaRow}>
          <Text>Time Allowed: {metadata.timeAllowed}</Text>
          <Text>Maximum Marks: {metadata.maxMarks}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={[styles.subheading, { fontStyle: "italic" }]}>
          All questions are compulsory unless stated otherwise.
        </Text>
        <View style={styles.divider} />
        <Text style={{ fontSize: 10, marginBottom: 4 }}>
          Name: ________________________ Roll Number: ________________
        </Text>
        <Text style={{ fontSize: 10, marginBottom: 8 }}>
          Class: {metadata.class} Section: ____________
        </Text>
        <View style={styles.divider} />
        {sections.map((s) => (
          <PDFSection key={s.title} section={s} />
        ))}
        <Text style={styles.endText}>End of Question Paper</Text>
        {answerKey.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.answerHeading}>Answer Key</Text>
            {answerKey.map((a) => (
              <View key={a.number} style={styles.answerRow}>
                <Text style={styles.answerNum}>{a.number}.</Text>
                <Text style={styles.answerText}>{a.answer}</Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
}
