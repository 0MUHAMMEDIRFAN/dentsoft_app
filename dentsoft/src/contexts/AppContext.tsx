import { useState, createContext, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContext } from "./ToastContext";
// import moment from "moment";
import { Patient } from "../types/types";

export interface AppContextType {
  location: any;
  userDetails: any;
  setUserDetails: any;
  sidebarCollapse: any;
  setSidebarCollapse: any;
  viewMedical: any;
  setViewMedical: any;
  viewDocument: any;
  setViewDocument: any;
  addDocumentClicked: any;
  setAddDocumentClicked: any;
  addMedicalClicked: any;
  setAddMedicalClicked: any;
  addPatientForm: any;
  setAddPatientForm: any;
  medicalForm: any;
  setMedicalForm: any;
  documentForm: any;
  setDocumentForm: any;
  medicalFormId: any;
  setMedicalFormId: any;
  DocumentId: any;
  setDocumentId: any;
  addPaymentClicked: any;
  setAddPaymentClicked: any;
  viewPayment: any;
  setViewPayment: any;
  user: any;
  setUser: any;
  selectedPatient: any;
  setSelectedPatient: any;
  filterSidebarItems: any;
  selectPatient: any;
  deselectPatient: any;
  handleEditPatient: any;
  sidebarItems: any;
  setSidebarItems: any;
  searchText: any;
  setSearchText: any;
  searchValue: any;
  setSearchValue: any;
  patientButton: any;
  setPatientButton: any;
  isAddPatientOpen: any;
  setIsAddPatientOpen: any;
  selectedPatientId: any;
  setSelectedPatientId: any;
  selectSidebarItem: any;
  selectedTeeth: any;
  setSelectedTeeth: any;
  selectedAppointment: any;
  setSelectedAppointment: any;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppContextProvider = ({ children }: any) => {
  const location = useLocation();
  const navigate = useNavigate()
  const checkCurrentPage = () => {
    if (!localStorage.getItem("userDetails")) {
    }
    if (location.pathname === "/login") {
      if (localStorage.getItem("access_token") != "" && localStorage.getItem("access_token") != null && localStorage.getItem("access_token") != undefined && localStorage.getItem("userDetails")) {
        navigate("/home")
      } else {
        localStorage.clear()
        deselectPatient();
      }
    } else if (location.pathname === "/") {
      (localStorage.getItem("access_token") == "" ||
        localStorage.getItem("access_token") == null ||
        localStorage.getItem("access_token") == undefined ||
        !localStorage.getItem("userDetails")
      )
        ? navigate("/login")
        : navigate("/home")
    } else if (localStorage.getItem("access_token") == "" ||
      localStorage.getItem("access_token") == null ||
      localStorage.getItem("access_token") == undefined ||
      !localStorage.getItem("userDetails")
    ) {
      localStorage.clear()
      deselectPatient();
      navigate("/login")
      notify("Please login in order to proceed", "warning")
    }
  }
  useEffect(() => {
    // checkCurrentPage()
  }, [location])
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem("userDetails") || ""));
  const [selectedPatient, setSelectedPatient] = useState(JSON.parse(localStorage.getItem("selectedPatient") || ""));
  const [selectedAppointment, setSelectedAppointment] = useState(JSON.parse(localStorage.getItem("selectedAppointment") || ""))
  // const [userPermissions, setUserPermissions] = useState({ Home: [], Topbar: [], User: [], Analysis: [], Other: [], Scheme: [], Treatment: [], Overview: [], medHistory: [] })
  const AllSidebarItems = [
    { name: "Calendar", icon: "uil uil-schedule", navigate: "/home", selected: false, patientRelated: false, onlyAdmin: false },
    { name: "Calendar", icon: "uil uil-schedule", navigate: "/home", selected: false, patientRelated: true, onlyAdmin: false },
    { name: "Patient", icon: "uil uil-user-nurse", navigate: "/patient/overview", selected: false, patientRelated: true, onlyAdmin: false },
    // { name: "Overview", icon: "uil uil-chart", navigate: "/overview", selected: false, patientRelated: true, onlyAdmin: false },
    // { name: "Alerts", icon: "bx bx-bell", navigate: "/", selected: false , patientRelated:false,onlyAdmin:true },
    // { name: "Documents", icon: "uil uil-file-alt", navigate: "/patient-documents", selected: false, patientRelated: true, onlyAdmin: false },
    // { name: "Appointments", icon: "uil uil-book-medical", navigate: "/patient-appointments", selected: false, patientRelated: true, onlyAdmin: false },
    // { name: "Med History", icon: "uil uil-history", navigate: "/patient-medicalhistory", selected: false, patientRelated: true, onlyAdmin: false },
    // { name: "Payments", icon: "uil uil-credit-card", navigate: "/patient-payments", selected: false, patientRelated: true, onlyAdmin: false },
    { name: "Admin Settings", icon: "uil uil-setting", navigate: "/user-managment", selected: false, patientRelated: false, onlyAdmin: false },
    { name: "Reports", icon: "uil uil-chart-line", navigate: "/report-and-analysis", selected: false, patientRelated: false, onlyAdmin: false },
    { name: "Schemes", icon: "uil uil-notebooks", navigate: "/schemes", selected: false, patientRelated: false, onlyAdmin: false },
    { name: "Treatments", icon: "uil uil-medkit", navigate: "/treatments", selected: false, patientRelated: false, onlyAdmin: false },

  ]
  const filterSidebarItems = () => AllSidebarItems.filter((item) => selectedPatient ? item.patientRelated : userDetails?.name === "admin" ? !item.patientRelated : (!item.patientRelated && !item.onlyAdmin));
  const [sidebarItems, setSidebarItems] = useState(filterSidebarItems())
  // const [selectedAppointment, setSelectedAppointment] = useState("")
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [viewPayment, setViewPayment] = useState(true);
  const [addPaymentClicked, setAddPaymentClicked] = useState(false); //This for adding animation smmothly between view payment tab and addpayment tab 
  const [viewMedical, setViewMedical] = useState(true);
  const [viewDocument, setViewDocument] = useState(true);
  const [addMedicalClicked, setAddMedicalClicked] = useState(false); //This for adding animation smmothly between MedicalHistory tab and add Medical form tab
  const [addDocumentClicked, setAddDocumentClicked] = useState(false); //This for adding animation smmothly between Documents tab and add document tab
  const [searchText, setSearchText] = useState("")
  const [patientButton, setPatientButton] = useState(true)
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>("")
  const [medicalFormId, setMedicalFormId] = useState(true)
  const [DocumentId, setDocumentId] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const [user, setUser] = useState(false);
  const [addPatientForm, setAddPatientForm] = useState<Patient>({
    first_name: "",
    patient_no: "",
    ID: "",
    email: "",
    mobile: "",
    dob: "",
    custom_scheme: "",
    scheme: "",
    sex: "",
    address: "",
    address2: "",
    custom_patient_type: "",
    patient_type: "",
    enabled_communications: {
      text: false,
      voice: false,
      email: false,
    },
  })
  const [medicalForm, setMedicalForm] = useState({
    name: "",
    description: "",
    alert: true,
    is_document: false,
    input_fields: [],
  });
  const [documentForm, setDocumentForm] = useState({
    title: "",
    description: "",
    editable: false,
    doctor_signature: false,
    patient_signature: false,
    clinic_stamp: false
  });
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const { notify } = useContext(ToastContext)
  const deselectPatient = () => {
    setSearchValue(searchText)
    localStorage.removeItem("selectedPatient")
    localStorage.removeItem("selectedAppointment")
    setSelectedPatient(undefined);
    setSelectedAppointment(undefined)
    setSidebarItems(AllSidebarItems.filter((item) => userDetails?.name === "admin" ? !item.patientRelated : (!item.patientRelated && !item.onlyAdmin)));
  }

  const selectPatient = (patient: Patient) => {
    if (patient) {
      console.log(patient)
      setSidebarCollapse(true)
      setSelectedPatient(patient);
      localStorage.setItem("selectedPatient", JSON.stringify(patient))
      setSearchText("");
      setSidebarItems(AllSidebarItems.filter((item) => item.patientRelated));
    }
  }
  const handleEditPatient = (patient: Patient) => {
    if (patient) {
      setPatientButton(false);
      const address = patient.address?.split("§ͱ") || ""
      setAddPatientForm({
        first_name: patient.patient_name,
        ID: "a0a9b7db-6f8e-4f67-81ef-6f7d69c8b822",
        patient_no: patient.patient_no,
        email: patient.email,
        mobile: patient.mobile,
        dob: patient.dob,
        custom_scheme: patient.custom_scheme || "",
        scheme: patient.custom_scheme,
        sex: patient.sex,
        address: address[0] || "",
        address2: address[1] || "",
        custom_patient_type: patient.custom_patient_type || "",
        patient_type: patient.patient_type,
        enabled_communications: patient.enabled_communications
      });
      console.log(patient)
      setSearchText("")
      setSearchValue("")
      setIsAddPatientOpen(true)
      setSelectedPatientId(patient.name)
    }
  }

  // const CatogariseUserPermissions = () =>
  //   userDetails?.role?.Role_Permission?.map(permission => {
  //     setUserPermissions(prev => {
  //       const splitted = permission?.permission?.name?.split(':')
  //       switch (true) {
  //         case splitted[splitted.length - 1] === "overview": return { ...prev, Analysis: [...prev.Analysis, permission.permission] }
  //         case splitted[0] === "appointment": return { ...prev, Home: [...prev.Home, permission.permission] }
  //         case splitted[0] === "role" || splitted[0] === "user": return { ...prev, User: [...prev.User, permission.permission] }
  //         case splitted[0] === "scheme": return { ...prev, Scheme: [...prev.Scheme, permission.permission] }
  //         case splitted[0] === "treatment": return { ...prev, Scheme: [...prev.Scheme, permission.permission] }
  //         case splitted[0] === "payment": return { ...prev, Scheme: [...prev.Scheme, permission.permission] }
  //         case splitted[0] === "document": return { ...prev, Scheme: [...prev.Scheme, permission.permission] }
  //         default: return { ...prev, Other: [...prev.Other, permission.permission] }
  //       }
  //     })
  //   })
  useEffect(() => {
    // CatogariseUserPermissions()
  }, [userDetails])

  const selectSidebarItem = () => {
    setSidebarItems((prev) =>
      prev.map(item =>
        location.pathname.startsWith("/patient") && item.navigate.startsWith("/patient") ? { ...item, selected: true } :
          item.navigate === location.pathname ? { ...item, selected: true } : { ...item, selected: false })
    )
  }

  const value = {
    location,
    userDetails,
    setUserDetails,
    sidebarCollapse,
    setSidebarCollapse,
    viewMedical,
    setViewMedical,
    viewDocument,
    setViewDocument,
    addDocumentClicked,
    setAddDocumentClicked,
    addMedicalClicked,
    setAddMedicalClicked,
    addPatientForm,
    setAddPatientForm,
    medicalForm,
    setMedicalForm,
    documentForm,
    setDocumentForm,
    medicalFormId,
    setMedicalFormId,
    DocumentId,
    setDocumentId,
    addPaymentClicked,
    setAddPaymentClicked,
    viewPayment,
    setViewPayment,
    user,
    setUser,
    selectedPatient,
    setSelectedPatient,
    filterSidebarItems,
    selectPatient,
    deselectPatient,
    handleEditPatient,
    sidebarItems,
    setSidebarItems,
    searchText,
    setSearchText,
    searchValue,
    setSearchValue,
    patientButton,
    setPatientButton,
    isAddPatientOpen,
    setIsAddPatientOpen,
    selectedPatientId,
    setSelectedPatientId,
    selectSidebarItem,
    selectedTeeth,
    setSelectedTeeth,
    selectedAppointment,
    setSelectedAppointment
  };
  return <AppContext.Provider value={value}> {children} </AppContext.Provider>;
};
