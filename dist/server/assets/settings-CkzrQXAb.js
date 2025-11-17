import { o as jsxRuntimeExports, a as reactExports } from "../server.js";
import { d as CardContent, e as CardFooter, C as Card, a as CardHeader, b as CardTitle } from "./card-3t2RcMMr.js";
import { c as cva, a as createDialogScope, R as Root, T as Trigger, P as Portal, W as WarningProvider, C as Content, b as Title, D as Description, d as Close, O as Overlay, e as buttonVariants, I as Input, B as Button, X, f as Trash2, L as LoadingIndicator, g as Dialog, h as DialogTrigger, i as Plus, j as DialogContent, k as DialogHeader, l as DialogTitle, m as DialogFooter } from "./input-CG0OJuxL.js";
import { u as useComposedRefs, c as createContextScope, a as composeEventHandlers, b as useRegularPaymentsQuery, d as useUpdateRegularPaymentMutation, e as useDeleteRegularPaymentMutation, f as useCreateRegularPaymentMutation } from "./queries-DSf7RaaT.js";
import { c as cn } from "./utils-yaVLMgP5.js";
import { C as Check } from "./check-B5L_bvcl.js";
import { c as createLucideIcon } from "./createLucideIcon-BH4JToHI.js";
import "node:async_hooks";
import "node:stream";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream/web";
import "./clsx-DgYk2OaC.js";
import "./router-BgvrDMcr.js";
import "./auth-C4SSSEjI.js";
import "./category-service-C0JJXc5T.js";
import "./auth-DKIui-sa.js";
import "events";
import "dns";
import "fs";
import "net";
import "tls";
import "path";
import "string_decoder";
import "./record-service-BSDGGsDg.js";
import "./types-C7HdlGsq.js";
import "./exchange-rate-service-CkHVYlz5.js";
import "./regular-payment-service-C1vIS-1Z.js";
import "./charts-service-w7qs1cxG.js";
const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
// @__NO_SIDE_EFFECTS__
function createSlottable(ownerName) {
  const Slottable2 = ({ children }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  };
  Slottable2.displayName = `${ownerName}.Slottable`;
  Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
  return Slottable2;
}
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = /* @__PURE__ */ createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              event.preventDefault();
              cancelRef.current?.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    const hasDescription = document.getElementById(
      contentRef.current?.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Trigger2 = AlertDialogTrigger$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
const AlertDialog = Root2;
const AlertDialogTrigger = Trigger2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/40  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const usePaymentUtils = () => {
  const isPaymentStale = (lastModified) => {
    if (!lastModified) return false;
    const thirtyDaysAgo = /* @__PURE__ */ new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(lastModified) < thirtyDaysAgo;
  };
  const getTextColor = (value, data) => {
    if (!data || data.length === 0) return "hsl(var(--primary))";
    const values = data.map((item) => item.amount);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    const normalizedValue = range === 0 ? 0.5 : (value - minValue) / range;
    const colorStops = [
      { point: 0, color: { h: 142, s: 76, l: 36 } },
      // Green (low)
      { point: 0.5, color: { h: 35, s: 92, l: 58 } },
      // Yellow/Orange (middle)
      { point: 1, color: { h: 0, s: 84, l: 60 } }
      // Red (high)
    ];
    let lowerStop = colorStops[0];
    let upperStop = colorStops[colorStops.length - 1];
    for (let i = 0; i < colorStops.length - 1; i++) {
      if (normalizedValue >= colorStops[i].point && normalizedValue <= colorStops[i + 1].point) {
        lowerStop = colorStops[i];
        upperStop = colorStops[i + 1];
        break;
      }
    }
    const stopRange = upperStop.point - lowerStop.point;
    const stopFraction = stopRange === 0 ? 0 : (normalizedValue - lowerStop.point) / stopRange;
    const h = Math.round(
      lowerStop.color.h + stopFraction * (upperStop.color.h - lowerStop.color.h)
    );
    const s = Math.round(
      lowerStop.color.s + stopFraction * (upperStop.color.s - lowerStop.color.s)
    );
    const l = Math.round(
      lowerStop.color.l + stopFraction * (upperStop.color.l - lowerStop.color.l)
    );
    return `hsl(${h}, ${s}%, ${l}%)`;
  };
  return {
    isPaymentStale,
    getTextColor
  };
};
function RegularPaymentItem({
  payment
}) {
  const { data: payments = [] } = useRegularPaymentsQuery();
  const updateMutation = useUpdateRegularPaymentMutation();
  const deleteMutation = useDeleteRegularPaymentMutation();
  const { isPaymentStale, getTextColor } = usePaymentUtils();
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [editingPayment, setEditingPayment] = reactExports.useState({
    ...payment
  });
  const handleEditPayment = () => {
    setIsEditing(true);
    setEditingPayment({ ...payment });
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPayment({ ...payment });
  };
  const handleSaveEdit = () => {
    updateMutation.mutate(editingPayment, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };
  const handleEditingChange = (field, value) => {
    setEditingPayment((prev) => ({
      ...prev,
      [field]: field === "amount" ? parseFloat(value) || 0 : value
    }));
  };
  const handleDeletePayment = () => {
    if (payment.id) {
      deleteMutation.mutate(payment.id);
    }
  };
  const displayPayment = isEditing ? editingPayment : payment;
  const isStale = isPaymentStale(payment.lastModified);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `flex space-x-2 ${isEditing ? "items-start" : "items-center"}`,
      children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Name",
              value: displayPayment.name,
              onChange: (e) => handleEditingChange("name", e.target.value),
              className: "w-full"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2", children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                placeholder: "0.00",
                value: displayPayment.amount,
                onChange: (e) => handleEditingChange("amount", e.target.value),
                className: "pl-7 w-full",
                step: "0.01",
                min: "0"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: handleSaveEdit,
              disabled: updateMutation.isPending,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: handleCancelEdit, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-1 space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 font-medium pl-3",
              style: {
                borderLeft: `4px solid ${getTextColor(
                  payment.amount,
                  payments
                )}`
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: payment.name })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-auto text-right font-medium", children: [
            "$",
            payment.amount.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
          isStale && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-xs", children: "Old" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: handleEditPayment, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Regular Payment" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                  'Are you sure you want to delete "',
                  payment.name,
                  '"? This action cannot be undone.'
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: handleDeletePayment,
                    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                    children: "Delete"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] })
    }
  );
}
function AddPaymentForm({
  onCancel,
  value,
  onChange,
  hideActions
}) {
  const createMutation = useCreateRegularPaymentMutation();
  const [internalPayment, setInternalPayment] = reactExports.useState({
    name: "",
    amount: 0
  });
  const payment = value ?? internalPayment;
  const updatePayment = (next) => {
    if (onChange) {
      onChange(next);
    } else {
      setInternalPayment(next);
    }
  };
  const handleSave = () => {
    createMutation.mutate(payment, {
      onSuccess: () => {
        if (!onChange) {
          setInternalPayment({ name: "", amount: 0 });
        }
        onCancel();
      }
    });
  };
  const handleCancel = () => {
    if (!onChange) {
      setInternalPayment({ name: "", amount: 0 });
    }
    onCancel();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start space-x-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Name",
          value: payment.name,
          onChange: (e) => updatePayment({ ...payment, name: e.target.value }),
          className: "w-full"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2", children: "$" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            placeholder: "0.00",
            value: payment.amount,
            onChange: (e) => updatePayment({
              ...payment,
              amount: parseFloat(e.target.value) || 0
            }),
            className: "pl-7 w-full",
            step: "0.01",
            min: "0"
          }
        )
      ] })
    ] }),
    !hideActions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: handleSave,
          disabled: createMutation.isPending,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: handleCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] })
  ] });
}
function RegularPaymentsList() {
  const { data: regularPayments, isLoading, error } = useRegularPaymentsQuery();
  const [payments, setPayments] = reactExports.useState([]);
  const [totalAmount, setTotalAmount] = reactExports.useState(0);
  const [isAddingNew, setIsAddingNew] = reactExports.useState(false);
  const [newPayment, setNewPayment] = reactExports.useState({
    name: "",
    amount: 0
  });
  const createMutation = useCreateRegularPaymentMutation();
  reactExports.useEffect(() => {
    if (regularPayments && Array.isArray(regularPayments)) {
      const sortedPayments = [...regularPayments].sort(
        (a, b) => b.amount - a.amount
      );
      setPayments(sortedPayments);
      calculateTotal(sortedPayments);
    }
  }, [regularPayments]);
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
  };
  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewPayment({ name: "", amount: 0 });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingIndicator, { className: "pb-4" });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Error loading regular payments" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: payments.map((payment) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      RegularPaymentItem,
      {
        payment
      },
      payment.id || "new"
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardFooter, { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex space-x-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dialog,
        {
          open: isAddingNew,
          onOpenChange: (open) => {
            setIsAddingNew(open);
            if (!open) {
              setNewPayment({ name: "", amount: 0 });
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
              " Add Payment"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Regular Payment" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AddPaymentForm,
                {
                  onCancel: handleCancelNew,
                  value: newPayment,
                  onChange: setNewPayment,
                  hideActions: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => createMutation.mutate(newPayment, {
                    onSuccess: () => {
                      setNewPayment({ name: "", amount: 0 });
                      setIsAddingNew(false);
                    }
                  }),
                  disabled: createMutation.isPending || !newPayment.name.trim() || (newPayment.amount ?? 0) <= 0,
                  children: "Add"
                }
              ) })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-right", children: [
        "Total: $",
        totalAmount.toFixed(2)
      ] })
    ] })
  ] });
}
function SettingsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold mb-6 px-4 py-2", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Regular Payments" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RegularPaymentsList, {})
    ] })
  ] });
}
export {
  SettingsPage as component
};
