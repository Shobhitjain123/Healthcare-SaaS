import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePatientStore } from "@/store/usePatientStore";
import { showNotification } from "@/utils/notification";
import type { Patient, SexAtBirth, RiskLevel } from "@/mock/types";
import { clinicDb } from "@/mock/clinicDb";

export function AddPatientModal() {
  const [open, setOpen] = useState(false);
  const addPatient = usePatientStore((state) => state.addPatient);
  const patients = usePatientStore((state) => state.patients);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    sexAtBirth: "unknown" as SexAtBirth,
    phone: "",
    email: "",
    primaryProviderId: clinicDb.providers[0]?.providerId || "",
    riskLevel: "low" as RiskLevel,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate patient ID and MRN based on current store patients
    const newPatientId = `pt_${String(patients.length + 1).padStart(3, "0")}`;
    const newMrn = `MRN-${String(100000 + patients.length + 1)}`;

    const newPatient: Patient = {
      patientId: newPatientId,
      mrn: newMrn,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      sexAtBirth: formData.sexAtBirth,
      phone: formData.phone,
      email: formData.email,
      address: {
        line1: "Address line 1",
        city: "City",
        state: "ST",
        zip: "00000",
      },
      insurance: {
        payerName: "Insurance Provider",
        planName: "Basic Plan",
        memberId: `M-${String(700000 + patients.length + 1)}`,
      },
      primaryProviderId: formData.primaryProviderId,
      riskLevel: formData.riskLevel,
      status: "active",
    };

    addPatient(newPatient);

    showNotification(`Patient ${formData.firstName} ${formData.lastName} added successfully`);

    // Reset form and close modal
    setFormData({
      firstName: "",
      lastName: "",
      dob: "",
      sexAtBirth: "unknown",
      phone: "",
      email: "",
      primaryProviderId: clinicDb.providers[0]?.providerId || "",
      riskLevel: "low",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">Add Patient</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sexAtBirth">Sex at Birth</Label>
            <select
              id="sexAtBirth"
              value={formData.sexAtBirth}
              onChange={(e) => setFormData({ ...formData, sexAtBirth: e.target.value as SexAtBirth })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="unknown">Unknown</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="intersex">Intersex</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryProviderId">Primary Provider</Label>
            <select
              id="primaryProviderId"
              value={formData.primaryProviderId}
              onChange={(e) => setFormData({ ...formData, primaryProviderId: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              {clinicDb.providers.map((provider) => (
                <option key={provider.providerId} value={provider.providerId}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskLevel">Risk Level</Label>
            <select
              id="riskLevel"
              value={formData.riskLevel}
              onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as RiskLevel })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Patient</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
