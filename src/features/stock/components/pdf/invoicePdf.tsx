// import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

// type InvoicePdfProps = {
//   invoice: any | undefined;
// };

// const InvoicePdf = ({ invoice }: InvoicePdfProps) => {
//   console.log('🚀 ~ InvoicePdf ~ invoice:', invoice);
//   if (!invoice) return null;

//   return (
//     <Document>
//       <Page size={'A4'}>
//         <View style={styles.page}>
//           <Text style={styles.title}>Invoice : {invoice.itemName}</Text>

//           <View style={styles.table}>
//             <View style={styles.tableRow}>
//               <Text style={styles.tableColHeader}>Item</Text>
//               <Text style={styles.tableColHeader}>Description</Text>
//               <Text style={styles.tableColHeader}>Quantity</Text>
//               <Text style={styles.tableColHeader}>Unit Price</Text>
//               <Text style={styles.tableColHeader}>Amount</Text>
//             </View>
//             <View style={styles.tableRow}>
//               {invoice.map((item: any, index: number) => {
//                 return (
//                   <View key={index}>
//                     <Text style={styles.tableCol}>{item.itemName}</Text>
//                     <Text style={styles.tableCol}>{item.description}</Text>
//                     <Text style={styles.tableCol}>{item.quantity}</Text>
//                     <Text style={styles.tableCol}>{item.unitPrice}</Text>
//                     <Text style={styles.tableCol}>{item.unitPrice * item.quantity}</Text>
//                   </View>
//                 );
//               })}
//             </View>
//           </View>

//           <View style={styles.totalBox}>
//             <View style={styles.totalItem}>
//               <Text style={styles.totalLabel}>Total Amount</Text>
//               <Text style={styles.totalValue}>200</Text>
//             </View>
//             <View style={styles.totalItem}>
//               <Text style={styles.totalLabel}>Total Discount</Text>
//               <Text style={styles.totalValue}>40</Text>
//             </View>
//             <View style={styles.totalItem}>
//               <Text style={styles.totalLabel}>Grand Total</Text>
//               <Text style={styles.totalValue}>160</Text>
//             </View>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// export default InvoicePdf;

// const styles = StyleSheet.create({
//   page: {
//     padding: 12,
//     fontSize: 10,
//   },
//   title: {
//     fontSize: 12,
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   table: {
//     display: 'flex',
//     width: 'auto',
//     borderWidth: 1,
//     borderColor: '#EDEDED',
//     marginBottom: 20,
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   tableColHeader: {
//     width: '20%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#EDEDED',
//     backgroundColor: '#F5F5F5',
//     padding: 8,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   tableCol: {
//     width: '20%',
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#EDEDED',
//     padding: 8,
//     textAlign: 'center',
//   },
//   totalBox: {
//     marginTop: 20,
//     width: '50%',
//     marginLeft: 'auto',
//     borderTopWidth: 1,
//     borderTopColor: '#EDEDED',
//     borderStyle: 'solid',
//   },
//   totalItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 4,
//   },
//   totalLabel: {
//     textAlign: 'left',
//     fontWeight: 'bold',
//   },
//   totalValue: {
//     textAlign: 'right',
//   },
// });
import { DEFAULT_CURRENCY } from '@configs/index';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { formatCurrency, formatDate } from '@utils/index';

type InvoicePdfProps = {
  invoice: any | undefined;
};

const InvoicePdf = ({ invoice }: InvoicePdfProps) => {
  console.log('🚀 ~ InvoicePdf ~ invoice:', invoice);
  if (!invoice) return null;
  const totalAmount = invoice.reduce((total: number, item: any) => total + item.unitPrice * item.quantity, 0);

  const totalDiscount = invoice.reduce(
    (total: number, item: any) => total + (item.discount || 0), // If discounts exist, otherwise set it as 0
    0
  );

  const grandTotal = totalAmount - totalDiscount;
  return (
    <Document>
      <Page size={'A4'} style={{ padding: 12 }}>
        <View style={styles.page}>
          <View style={styles.details}>
            <Text style={styles.title}>Invoice</Text>
            <Text style={styles.subTitle}># 002123</Text>
            <Text style={styles.subTitle}>Date : {formatDate(new Date())}</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow} fixed>
              <Text style={styles.tableColHeader}>Item</Text>
              <Text style={styles.tableColHeader}>Description</Text>
              <Text style={styles.tableColHeader}>Quantity</Text>
              <Text style={styles.tableColRightHeader}>Unit Price ({DEFAULT_CURRENCY})</Text>
              <Text style={styles.tableColRightHeader}>Amount ({DEFAULT_CURRENCY})</Text>
            </View>
            {invoice.map((item: any, index: number) => (
              <View style={styles.tableRow} key={index} wrap={false}>
                <Text style={styles.tableCol}>{item.itemName}</Text>
                <Text style={styles.tableCol}>{item.description ? item.description : '-'}</Text>
                <Text style={styles.tableCol}>{item.quantity}</Text>
                <Text style={styles.rightAlignTableCol}>{item.unitPrice}</Text>
                <Text style={styles.rightAlignTableCol}>{(item.unitPrice * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.totalBox} wrap={false}>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Total Amount ({DEFAULT_CURRENCY}):</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Total Discount ({DEFAULT_CURRENCY}):</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalDiscount)}</Text>
            </View>
            <View style={[styles.totalItem, styles.grandTotal]}>
              <Text style={styles.totalLabel}>Grand Total ({DEFAULT_CURRENCY}):</Text>
              <Text style={styles.totalValue}>{formatCurrency(grandTotal)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;

const styles = StyleSheet.create({
  page: {
    padding: 12,
    fontSize: 8,
    color: '#16578c',
  },
  details: {
    gap: 4,
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#16578c',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 12,
    fontWeight: 'heavy',
    textTransform: 'uppercase',
  },
  table: {
    display: 'flex',
    borderRadius: '4px',
    width: 'auto',
    borderWidth: 1,
    borderColor: '#EDEDED',
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderRadius: '4px',
  },
  tableRow: {
    flexDirection: 'row',
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: '#EDEDED',
  },
  tableColHeader: {
    width: '20%',
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#EDEDED',
    backgroundColor: '#F5F5F5',
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableColRightHeader: {
    width: '20%',
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#EDEDED',
    backgroundColor: '#F5F5F5',
    padding: 8,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '20%',
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#EDEDED',
    padding: 8,
    textAlign: 'center',
  },
  totalBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderStyle: 'solid',
    borderRadius: 4,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    textAlign: 'left',
    fontWeight: 'bold',
  },
  totalValue: {
    textAlign: 'right',
  },
  grandTotal: {
    fontSize: 10,
    color: '#000',
    borderTopWidth: 1,
    borderTopColor: '#EDEDED',
    marginTop: 8,
  },
  rightAlignTableCol: {
    width: '20%',
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#EDEDED',
    padding: 8,
    textAlign: 'right',
  },
});
