// app/checkout/page.tsx
"use client";

import PayPalCheckout from "@/components/PayPalCheckout";
import { useReservationStore } from "@/lib/stores/reservation-store";
import { useRouter } from "next/navigation";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { CheckoutSchema, checkoutSchema } from "@/lib/schemas/checkout-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldSet,
  FieldLegend,
  FieldContent,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupTextarea,
  InputGroupText,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useReservationStore((state) => state.items);
  // En CheckoutPage
  const setCheckoutData = useReservationStore((state) => state.setCheckoutData);
  const setCheckoutComplete = useReservationStore(
    (state) => state.setCheckoutComplete
  );
  const isCheckoutComplete = useReservationStore(
    (state) => state.isCheckoutComplete
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Redirecting to home...", {
        position: "top-center",
      });

      const timer = setTimeout(() => {
        router.push("/");
      }, 1500);

      // ✅ Limpia el timer solo cuando el componente se desmonte
      return () => clearTimeout(timer);
    }
  }, [cartItems.length, router]); // ✅ Remueve isRedirecting de las dependencias

  // ✅ Early return si el carrito está vacío
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center h-screen flex items-center justify-center">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      phones: [{ phone: "" }],
      hotel: "",
      reservation_number: "",
      room_number: "",
      medic_note: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phones",
  });

  function onSubmit(data: CheckoutSchema) {
    setCheckoutData(data); // Guarda los datos
    setCheckoutComplete(true); // Habilita el pago
    toast.success("Information saved! You can now proceed to payment.", {
      position: "top-center",
    });
  }

  // ✅ Manejar el éxito del pago
const handleSuccess = async (details: any) => {
  console.log("💳 Payment successful:", details);
  
  // ✅ Mostrar loading
  toast.loading("Creating your reservation...", {
    id: "creating-reservation",
    position: "top-center",
  });

  try {
    // ✅ Obtener datos del store
    const checkoutData = useReservationStore.getState().checkoutData;
    
    console.log("📦 Checkout data:", checkoutData);
    console.log("🛒 Cart items:", cartItems);
    
    if (!checkoutData) {
      throw new Error("Checkout data not found. Please fill the form first.");
    }

    // ✅ Log del payload ANTES de enviar
    const payload = {
      paypalOrderId: details.id,
      checkoutData,
      cartItems,
    };
    console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

    // ✅ Crear la reserva en la base de datos
    const response = await fetch("/api/reservations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("📥 Response status:", response.status);
    console.log("📥 Response ok:", response.ok);

    // ✅ Leer el body ANTES de verificar si es ok
    const data = await response.json();
    console.log("📥 Response data:", data);

    if (!response.ok) {
      // ✅ Mostrar el error específico del servidor
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    console.log("✅ Reservation created:", data);

    // ✅ Mostrar éxito
    toast.success("Reservation created successfully!", {
      id: "creating-reservation",
      position: "top-center",
    });

    // ✅ Limpiar el carrito y datos de checkout
    useReservationStore.getState().clearReservation();
    
    // ✅ Pequeño delay para que el usuario vea el mensaje
    setTimeout(() => {
      router.push(`/order-confirmation/${data.id}`);
    }, 1000);

  } catch (error: any) {
    console.error("❌ Error creating reservation:", error);
    console.error("❌ Error stack:", error.stack);
    
    // ✅ Mostrar error específico
    toast.error(
      error.message || "Failed to create reservation",
      {
        id: "creating-reservation",
        position: "top-center",
        duration: 10000,
        description: `PayPal Order ID: ${details.id}. Please contact support.`,
      }
    );
  }
};

  const handleError = (error: any) => {
    console.error("❌ Payment error:", error);
    toast.error("Payment failed. Please try again.", {
      position: "top-center",
    });
  };

  return (
    <div className="flex lg:flex-row flex-col gap-4 lg:gap-16 w-full">
      <div className="flex flex-col gap-4 flex-1">
        <section className="flex w-full gap-2 md:gap-4 flex-col">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Checkout</CardTitle>
              <CardDescription>
                Please fill out the form below to complete your reservation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="form-checkout" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="your name"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="lastname"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Lastname</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="your lastname"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="example@example.com"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <FieldSet className="gap-4">
                    <FieldLegend variant="label">Phone Numbers</FieldLegend>
                    <FieldDescription>
                      Add up to 2 phone numbers where we can contact you.
                    </FieldDescription>
                    <FieldGroup className="gap-4">
                      {fields.map((field, index) => (
                        <Controller
                          key={field.id}
                          name={`phones.${index}.phone`}
                          control={form.control}
                          render={({ field: controllerField, fieldState }) => (
                            <Field
                              orientation="horizontal"
                              data-invalid={fieldState.invalid}
                            >
                              <FieldContent>
                                <InputGroup>
                                  <InputGroupInput
                                    {...controllerField}
                                    id={`form-phone-${index}`}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="your phone number (e.g. +123456789)"
                                    type="tel"
                                    autoComplete="tel"
                                  />
                                  {fields.length > 1 && (
                                    <InputGroupAddon align="inline-end">
                                      <InputGroupButton
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => remove(index)}
                                        aria-label={`Remove email ${index + 1}`}
                                      >
                                        <XIcon />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                  )}
                                </InputGroup>
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </FieldContent>
                            </Field>
                          )}
                        />
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ phone: "" })}
                        disabled={fields.length >= 2}
                      >
                        Add Phone Number
                      </Button>
                    </FieldGroup>
                    {form.formState.errors.phones?.root && (
                      <FieldError
                        errors={[form.formState.errors.phones.root]}
                      />
                    )}
                  </FieldSet>
                  <Controller
                    name="hotel"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Hotel</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Hotel name"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="reservation_number"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Reservation Number
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="your hotel reservation number"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="room_number"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Room Number
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="your hotel room number"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="medic_note"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Medic Notes
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id={field.name}
                            placeholder="e.g., Asthma, severe allergies, high blood pressure, motion sickness."
                            rows={6}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {field.value?.length}/100 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <FieldDescription>
                          Please inform us of any condition that may affect your
                          safety or comfort during the tour, or leave this field
                          empty.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter>
              <Field orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setCheckoutComplete(false);
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  form="form-checkout"
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                >
                  {form.formState.isSubmitting
                    ? "Saving..."
                    : isCheckoutComplete
                    ? "Update Information"
                    : "Save & Continue to Payment"}
                </Button>
              </Field>
            </CardFooter>
          </Card>
        </section>
      </div>
      <aside id="payment-section" className="flex flex-col lg:w-96">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Payment</CardTitle>
            <CardDescription>
              {!isCheckoutComplete && "Please complete the checkout form first"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PayPalCheckout
              cartItems={cartItems}
              onSuccess={handleSuccess}
              onError={handleError}
              disabled={!isCheckoutComplete} // ✅ Nueva prop
            />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
