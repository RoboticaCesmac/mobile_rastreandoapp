import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const links = {
  'Colo de Útero': [
    { label: 'WHO - Cervical Cancer Guideline', url: 'https://www.who.int/publications/i/item/9789240030824' },
    { label: 'NCBI - Cervical Cancer', url: 'https://www.ncbi.nlm.nih.gov/books/NBK572317' },
    { label: 'ASCO - Secondary Prevention Guideline', url: 'https://ascopost.com/issues/november-10-2022/asco-releases-updated-resource-stratified-guideline-for-the-secondary-prevention-of-cervical-cancer' },
    { label: 'FIGO - Cancer Staging', url: 'https://obgyn.onlinelibrary.wiley.com/doi/toc/10.1002/%28ISSN%291879-3479.figo-cancer-staging' },
    { label: 'FIGO - Cancer Report 2021', url: 'https://www.figo.org/figo-cancer-report-2021' },
    { label: 'NCCN - Cervical Cancer Guideline', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1426&' },
  ],
  'Mama': [
    { label: 'USPSTF - Breast Cancer Screening', url: 'https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening' },
    { label: 'ACR - Breast Cancer Screening Guidelines', url: 'https://www.acr.org/News-and-Publications/Media-Center/2023/New-ACR-Breast-Cancer-Screening-Guidelines-call-for-earlier-screening-for-high-risk-women' },
    { label: 'ESMO - Early Breast Cancer', url: 'https://www.esmo.org/guidelines/esmo-clinical-practice-guidelines-breast-cancer/early-breast-cancer' },
    { label: 'NCCN - Breast Cancer Guideline', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419&' },
  ],
  'Próstata': [
    { label: 'AUA - Prostate Cancer Guideline', url: 'https://www.auanet.org/guidelines-and-quality/guidelines/oncology-guidelines/prostate-cancer' },
    { label: 'EAU - Prostate Cancer Guideline', url: 'https://uroweb.org/guidelines/prostate-cancer' },
    { label: 'NCCN - Prostate Cancer Guideline', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459&' },
  ],
  'Colorretal': [
    { label: 'NCCN - Colorectal Cancer Guideline', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1459&' },
    { label: 'PubMed - Colorectal Cancer', url: 'https://pubmed.ncbi.nlm.nih.gov/39236750/' },
    { label: 'USPSTF - Colorectal Cancer Screening', url: 'https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening' },
    { label: 'Gastro - CRC Screening Recommendations', url: 'https://gastro.org/press-releases/u-s-multi-society-task-force-on-crc%E2%80%AFreleases-updated-screening-recommendations' },
    { label: 'GI - CRC Awareness Resources', url: 'https://gi.org/education/educating-you-your-colleagues/colorectal-cancer-awareness-education-resources' },
    { label: 'ESMO - Localised Colon Cancer', url: 'https://www.esmo.org/guidelines/esmo-clinical-practice-guideline-localised-colon-cancer' },
    { label: 'Annals of Oncology - Colon Cancer', url: 'https://www.annalsofoncology.org/article/S0923-7534%2825%2900731-8/fulltext' },
    { label: 'NCCN - Colon Cancer Guideline', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1428&' },
  ],
  'Pulmão': [
    { label: 'USPSTF - Lung Cancer Screening', url: 'https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening' },
    { label: 'NCCN - Lung Cancer Guideline', url: 'https://www.nccn.org/guidelines/guidelines-detail?category=2&id=1441' },
    { label: 'IASLC - LDCT Management', url: 'https://www.iaslc.org/iaslc-news/press-release/perspective-management-ldct-findings-low-dose-computed-tomography' },
    { label: 'NCCN - Recently Published Guidelines', url: 'https://www.nccn.org/guidelines/recently-published-guidelines' },
    { label: 'ESMO - Lung and Chest Tumours', url: 'https://www.esmo.org/guidelines/esmo-clinical-practice-guidelines-lung-and-chest-tumours' },
    { label: 'Annals of Oncology - Lung Cancer', url: 'https://www.annalsofoncology.org/article/S0923-7534%2825%2900813-0/fulltext' },
  ],
};

export default function LinksReferencias() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Botão de voltar no topo esquerdo */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 30, left: 20, zIndex: 10 }}
        onPress={() => router.back()}
      >
        <FontAwesome5 name="arrow-left" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={[styles.title, { marginTop: 70 }]}>Links e Referências</Text>
      <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
        {Object.entries(links).map(([neoplasia, lista]) => (
          <View key={neoplasia} style={styles.block}>
            <Text style={styles.blockTitle}>{neoplasia}</Text>
            {lista.map((link, idx) => (
              <TouchableOpacity key={link.url} style={styles.linkButton} onPress={() => Linking.openURL(link.url)}>
                <FontAwesome5 name="external-link-alt" size={18} color="#FFD700" style={{ marginRight: 8 }} />
                <Text style={styles.linkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232d97',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  block: {
    backgroundColor: '#3949AB',
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  blockTitle: {
    fontSize: 20,
    color: '#FFD700',
    fontFamily: 'Quicksand-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    textDecorationLine: 'underline',
  },
});
