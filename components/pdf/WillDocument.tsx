import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"

export interface WillData {
  first_name: string
  middle_name?: string
  last_name: string
  date_of_birth: string
  address_line1: string
  address_line2?: string
  city: string
  postcode: string
  marital_status: string
  children: Array<{ name: string; age?: string }>
  estate_value: string
  has_overseas_assets: boolean
  has_business_assets: boolean
  has_trusts: boolean
  primary_executor: { name: string; relationship: string; email?: string; phone?: string }
  backup_executor?: { name: string; relationship?: string; email?: string; phone?: string }
  main_beneficiary: { name: string; relationship: string; percentage?: string }
  additional_beneficiaries: Array<{ name: string; relationship: string; percentage?: string }>
  specific_gifts: Array<{ item: string; recipient: string }>
  residual_estate: string
  funeral_wishes?: string
  pet_care?: string
  digital_assets?: string
  verify_identity: boolean
  legal_declaration: boolean
  created_at: string
}

const styles = StyleSheet.create({
  page: {
    fontSize: 12,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
    lineHeight: 1.6,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subTitle: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: 6,
    borderBottomWidth: 1,
    paddingBottom: 3,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
  },
  listItem: {
    marginLeft: 15,
    marginBottom: 4,
  },
  signatureBlock: {
    marginTop: 24,
    borderTopWidth: 1,
    borderColor: "#000",
    paddingTop: 6,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 10,
    color: "#666",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 10,
    color: "#888",
  },
})

export const WillDocument = ({ will }: { will: WillData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>LAST WILL AND TESTAMENT</Text>
      <Text style={styles.subTitle}>of</Text>
      <Text style={styles.title}>{will.first_name} {will.middle_name || ""} {will.last_name}</Text>

      <Text style={styles.sectionHeader}>1. REVOCATION</Text>
      <Text style={styles.paragraph}>
        I, {will.first_name} {will.middle_name || ""} {will.last_name}, of {will.address_line1}
        {will.address_line2 ? `, ${will.address_line2}` : ""}, {will.city}, {will.postcode}, REVOKE all former wills and
        testamentary dispositions made by me and declare this to be my last Will.
      </Text>

      <Text style={styles.sectionHeader}>2. APPOINTMENT OF EXECUTORS</Text>
      <Text style={styles.paragraph}>
        I APPOINT {will.primary_executor.name}, my {will.primary_executor.relationship}, to be the Executor and Trustee of my Will.
      </Text>
      {will.backup_executor && (
        <Text style={styles.paragraph}>
          If {will.primary_executor.name} is unable or unwilling to act, I APPOINT {will.backup_executor.name}
          {will.backup_executor.relationship ? `, my ${will.backup_executor.relationship},` : ""} as a substitute.
        </Text>
      )}

      {will.specific_gifts.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>3. SPECIFIC GIFTS</Text>
          {will.specific_gifts.map((g, i) => (
            <Text key={i} style={styles.listItem}>
              • {g.item} to {g.recipient}
            </Text>
          ))}
        </>
      )}

      <Text style={styles.sectionHeader}>4. RESIDUARY ESTATE</Text>
      <Text style={styles.paragraph}>
        I GIVE all the residue of my estate, property and assets of whatever nature and wherever situated to{" "}
        {will.main_beneficiary.name}, my {will.main_beneficiary.relationship}, absolutely.
      </Text>

      {will.additional_beneficiaries.length > 0 && (
        <>
          <Text style={styles.paragraph}>Other beneficiaries:</Text>
          {will.additional_beneficiaries.map((b, i) => (
            <Text key={i} style={styles.listItem}>
              • {b.name} ({b.relationship}) – {b.percentage || "unspecified"}
            </Text>
          ))}
        </>
      )}

      {will.funeral_wishes && (
        <>
          <Text style={styles.sectionHeader}>5. FUNERAL WISHES</Text>
          <Text style={styles.paragraph}>{will.funeral_wishes}</Text>
        </>
      )}

      <Text style={styles.sectionHeader}>6. ATTESTATION</Text>
      <Text style={styles.paragraph}>
        IN WITNESS whereof I have hereunto set my hand to this my Will on the date written below.
      </Text>

      <View style={styles.signatureBlock}>
        <Text>__________________________</Text>
        <Text style={styles.signatureLabel}>Signature of Testator</Text>
      </View>
      <Text style={styles.signatureLabel}>Date: ____________________</Text>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.signatureLabel}>Signed by the above named {will.first_name} {will.last_name} as their last Will in our presence.</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text>__________________________</Text>
        <Text style={styles.signatureLabel}>Signature of First Witness</Text>
        <Text style={styles.signatureLabel}>Name: ____________________</Text>
        <Text style={styles.signatureLabel}>Address: ____________________</Text>
        <Text style={styles.signatureLabel}>Occupation: ____________________</Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text>__________________________</Text>
        <Text style={styles.signatureLabel}>Signature of Second Witness</Text>
        <Text style={styles.signatureLabel}>Name: ____________________</Text>
        <Text style={styles.signatureLabel}>Address: ____________________</Text>
        <Text style={styles.signatureLabel}>Occupation: ____________________</Text>
      </View>

      <Text style={styles.footer}>
        © {new Date().getFullYear()} My Easy Will — Generated on{" "}
        {new Date(will.created_at).toLocaleDateString()}
      </Text>
    </Page>
  </Document>
)
