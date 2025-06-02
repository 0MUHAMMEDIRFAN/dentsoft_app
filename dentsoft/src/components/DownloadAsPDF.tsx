import React from 'react';
import { Document, Page, Text, Image, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import DentSoft from "../assets/DentalLogo.svg"

const DownloadAsPDF = ({ data }) => {
    const BASE_URL = "http://localhost:3006"
    const styles = StyleSheet.create({
        page: {
            padding: 40,
        },
        text: {
            fontSize: 14,
            marginBottom: 10,
        },
    });

    return (
        <Document>
            <Page wrap size="A4" style={{ display: "flex", flexDirection: "column", padding: "12px", gap: "12px" }}>
                <View style={styles.text}>
                    <Image src={{ uri: BASE_URL + "/assets/DentalLogo.svg", method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} />
                </View>
                <View>
                    <Text style={{ fontSize: "20px", fontWeight: "semibold", }}>{data.title}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: "12px", fontWeight: "semibold", color: "#4B5563", whiteSpace: "prewrap" }}>{data.description}</Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: "8px", fontSize: "12px" }}>
                    {data.doctor_signature &&
                        // <div className='border p-5 rounded-md w-full'>
                        <View style={{ border: "1px", padding: "20px", borderRadius: "6px", borderColor: "#e5e7eb", width: "100%" }}>
                            <Text>Doctor : </Text>
                            <Text style={{ marginTop: "16px" }}>Signature : </Text>
                        </View>
                    }
                    {data.customer_signature &&
                        // <div className='border Text-5 rounded-md w-full'>
                        <View style={{ border: "1px", padding: "20px", borderRadius: "6px", borderColor: "#e5e7eb", width: "100%" }}>
                            <Text>Patient : </Text>
                            <Text style={{ marginTop: "16px" }}>Signature : </Text>
                        </View>
                    }
                </View>
                <View>
                    {data.clinic_stamp &&
                        <Text style={{ fontSize: "200px", color: "red", position: 'absolute', bottom: 0, left: 0, opacity: "50" }}></Text>
                        // <i className="bx bxs-certification text-[200px] text-red-700 absolute bottom-0 left-0 opacity-50" />
                    }
                </View>
                {/* {
                    Object.entries(data).map(([key, value], index) => (
                        <View key={index} style={styles.text}>
                            <Text>{`${key}: ${value}`}</Text>
                        </View>
                    ))
                } */}
            </Page >
        </Document >
    )
};


export default DownloadAsPDF;
