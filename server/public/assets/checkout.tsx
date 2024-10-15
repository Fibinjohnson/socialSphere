checkoutbutton.tsx



import * as React from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, doc, getFirestore, deleteDoc } from 'firebase/firestore';
import { PayPalButton } from 'react-paypal-button-v2'; // FIXME: use https://www.npmjs.com/package/@paypal/react-paypal-js
// NOTE: interesting facts about pp checkout process: https://stackoverflow.com/questions/69525236/react-paypal-button-v2-returning-the-wrong-order-id

import {
  ShoppingCartItemDocumentData,
  SourcedGQLProduct,
  ShoppingCartData,
  Price,
} from 'src/app/types';
import { Currency, NotificationType } from 'src/app/constants';

import { Grid, LoadingIndicator } from 'src/app/components';
import {
  useAppContext,
  useAppStaticQueryConfig,
  usePaypalStaticQueryConfig,
} from 'src/app/hooks';

import { useShoppingCartContext } from 'src/app/context';

// import { createBasicTimestamp } from 'src/lib/date';

import { replaceCartPartipantIds } from 'src/lib/participant';
import CallableAPI from 'src/api/callables';
import {
  calculateTotalPrice,
  getCartItemTotalPrice,
  getCartItemsTotalPrices,
  calculatePriceGroupPrice,
  calculatePriceGroupTotalPrice,
  createPriceString,
  padPrice,
  euroPriceAsCurrency,
} from 'src/lib/price';
import {
  PaypalButtonActions,
  PaypalOrderData,
  PaypalPurchaseUnit,
  PaypalPurchaseUnitItem,
  PaypalSuccessData,
  PaypalSuccessDetails,
} from '../../../../app/types/paypal.types';
import { UserCheckoutParams } from './checkoutButton.types';

import { createGroupedItemData, getOrderData, getPaypalOptions } from './lib';

// export interface CheckoutButtonProps extends BaseComponentProps {
//   cart: ShoppingCartData;
//   shoppingCartItemsSrcProducts: SourcedGQLProduct[];
//   areParticipantsValid: boolean;
// }

/**
 * @name CheckoutButton
 * @param { CheckoutButtonProps } props
 * @version 0.0.0
 * @description
 * - uses react-paypal-button-v2
 * - static query to get pp clientId
 * @todo
 * - window obj check
 * @example
 */
export interface CheckoutButtonProps {
  totalPrice: Price;
}
export const CheckoutButton = (props: CheckoutButtonProps) => {
  const {
    // areParticipantsValid, // TODO: implement correctly
    cartItems,
    currency,
    isCheckoutEnabled,
    // operatingMode,
    sourceProducts,
  } = useShoppingCartContext();

  const {  totalPrice } = props;

  const { createStackedNotification, firebase, user } = useAppContext();
  const [isPaypalLoading, setIsPaypalLoading] = React.useState<boolean>(true);
  const [isRequestingUpdate, setIsRequestingUpdate] = React.useState<boolean>(false);
  const { env } = useAppStaticQueryConfig();
  const { clientId: paypalClientId } = usePaypalStaticQueryConfig();

  const [orderDataState, setOrderDataState] = React.useState<PaypalOrderData | null>(
    null,
  );

  const [capturedOrderId, setCapturedOrderId] = React.useState<string | null>(null);

  console.log('sahddhusere',totalPrice)
  const hasPaypalClientId = !!paypalClientId;

  if (!paypalClientId || !currency || !user?.uid) {
    return null;
  }

  const paypalOptions = getPaypalOptions(paypalClientId, currency as Currency);

  const hasNotDefaultPickupOptions = cartItems.find((item) =>
    item.itemConfigurations.find((cfg) =>
      cfg.participants.find((p) => !p.options.pickup?.startsWith('__default')),
    ),
  );

  const createPriceZeroError = () => {
    createStackedNotification(NotificationType.ERROR, 'Price must not be zero');
    throw new Error('invalid-parms');
  };

  const deleteCartItems = (items: ShoppingCartItemDocumentData[]) => {
    return Promise.all([
      ...items.map((item) => {
        return deleteDoc(doc(getFirestore(firebase), `user/${user.uid}/cart/${item.id}`));
      }),
    ]);
  };

  const captureOrder = async (): Promise<string | null> => {
    console.log('captureOrder start');
    try {
      if (!firebase || !env /* || !isCheckoutEnabled */) {
        console.log('captureOrder precodition failed');
        createStackedNotification(NotificationType.ERROR, 'Checkout is disabled');
        return null; // TODO: msg
      }

      const orderData = {
        currency,
        cartItems,
        // sourceProducts, => dont need that on BE
        // user.uid, => use context
      };

      console.log('captureOrder - orderData: ', orderData);

      const { orderId } = await CallableAPI.ORDER.captureOrder(firebase, env, orderData);

      console.log('captureOrder - orderId: ', orderId);

      if (!orderId) {
        createStackedNotification(NotificationType.ERROR, 'Order not captured');
        return null;
      }
      setCapturedOrderId(orderId);
      return orderId;
    } catch (err) {
      console.log('error: ', err);
      createStackedNotification(
        NotificationType.ERROR,
        'Could not create order capture document',
      );
      return null;
    }
  };

  const createOrderMinimal = async (orderId: string): Promise<PaypalOrderData | null> => {
    try {
     
      // const cartItemTotalPrices: Price[] = [
      //   ...getCartItemsTotalPrices(cartItems, sourceProducts),
      // ];
      // const totalPrice = calculateTotalPrice(cartItemTotalPrices);
      const currency_code = currency as Currency;
      // const totalPriceValue =euroPriceAsCurrency(totalPrice, currency);
       const totalAmount = `${totalPrice.integer}.${totalPrice.decimal}`;

      const items: PaypalPurchaseUnitItem[] = [];
      // console.log('sajdhkjhsad',totalPrice,sourceProducts);
      cartItems.forEach((i) => {
        const sourcedProduct = sourceProducts.find((sp) => sp.id === i.productId);
        if (sourcedProduct) {
          items.push(
            ...createGroupedItemData(currency_code, i, sourcedProduct, user.uid, orderId),
          );
        }
      });

      const totalCurrency = currency_code;
      const shippingAmount = '0.00';
      const shippingCurrency = currency_code;
      const handlingAmount = '0.00';
      const handlingCurrency = currency_code;
      const taxTotalAmount = '0.00';
      const taxTotalCurrency = currency_code;
      const shippingDiscountAmount = '0.00';
      const shippingDiscountCurrency = currency_code;
      const totalPurchaseUnit: PaypalPurchaseUnit = {
        reference_id: orderId,
        custom_id: '',
        description: 'Your order at Hey.Holiday',
        // invoice_id: string;
        soft_descriptor: 'Your soft descriptor',
        amount: {
          currency_code: currency as Currency,
          value: totalAmount,
          breakdown: {
            item_total: {
              currency_code: totalCurrency,
              value: totalAmount,
            },
            shipping: {
              currency_code: shippingCurrency,
              value: shippingAmount,
            },
            handling: {
              currency_code: handlingCurrency,
              value: handlingAmount,
            },
            tax_total: {
              currency_code: taxTotalCurrency,
              value: taxTotalAmount,
            },
            shipping_discount: {
              currency_code: shippingDiscountCurrency,
              value: shippingDiscountAmount,
            },
          },
        },
        items, // if we put items we have to make breakdown in amount, do we actualy need this ????
        // shipping?
      };
      return {
        purchase_units: [totalPurchaseUnit],
      } as PaypalOrderData;
    } catch (err) {
      console.log('error: ', err);
      return null;
    }
  };

  const completeOrder = async (
    details: PaypalSuccessDetails,
    data: PaypalSuccessData,
  ): Promise<void> => {
    // const {} = details;
    // const {} = data;
    console.log('completeOrder start - details: ', details);
    let orderdata
    let item:Array<any>=[]
    if(data.orderID){
       orderdata = await createOrderMinimal(data.orderID);
       item=orderdata?.purchase_units[0].items
    }
    let orderdDetailsWithImg=details
    orderdDetailsWithImg.purchase_units[0].items=item
    /*
    {
      "id":"9S241774KT130984K",
      "intent":"CAPTURE",
      "status":"COMPLETED",
      "purchase_units":[
        {
          "reference_id":"bWjshHSA7SDEjQmxUHUP",
          "amount":{"currency_code":"EUR","value":"16.98"},
          "payee":{"email_address":"sb-jnmz65025102@business.example.com","merchant_id":"4GCZPMKS7ZF42"},
          "description":"Your order at Hey.Holiday",
          "soft_descriptor":"PAYPAL *JOHNDOESTES YO",
          "shipping":{"name":{"full_name":"Franjo Furuna"},
          "address":{"address_line_1":"Fake Address","admin_area_2":"New York","admin_area_1":"NY","postal_code":"10001","country_code":"US"}},
          "payments":{
            "captures":[
              {
                "id":"70K06707J6782983T",
                "status":"COMPLETED",
                "amount":{"currency_code":"EUR","value":"16.98"},
                "final_capture":true,
                "seller_protection":{"status":"ELIGIBLE","dispute_categories":["ITEM_NOT_RECEIVED","UNAUTHORIZED_TRANSACTION"]},
                "create_time":"2022-12-09T13:56:54Z",
                "update_time":"2022-12-09T13:56:54Z"}
            ]
          }
        }
      ],
      "payer":{
        "name":{"given_name":"Franjo","surname":"Furuna"},
        "email_address":"test@test.ts",
        "payer_id":"YGLKRENUAP3X2",
        "address":{"country_code":"US"}
      },
      "create_time":"2022-12-09T13:56:09Z",
      "update_time":"2022-12-09T13:56:54Z",
      "links":[
        {
          "href":"https://api.sandbox.paypal.com/v2/checkout/orders/9S241774KT130984K",
          "rel":"self",
          "method":"GET"
        }
      ]
    }
    */

    console.log('completeOrder start - data: ', data);
    console.log('completeOrder start - capturedOrderId: ', capturedOrderId);
    console.log(
      `Is ${capturedOrderId} equal to ${
        details.purchase_units.find((pu) => pu.reference_id === capturedOrderId)
          ?.reference_id
      }. It must be !!!`,
    );
    try {
      if (!firebase || !env || !capturedOrderId /* || !isCheckoutEnabled */) {
        console.log('completeOrder - precondition failed');
        createStackedNotification(NotificationType.ERROR, 'Precondition failed');
        return; // TODO: msg
      }
      // const res = await CallableAPI.ORDER.completeOrder(firebase, env, {
      //   orderId: capturedOrderId,
      // });

      const { orderId: confirmOrderId } = await CallableAPI.ORDER.completeOrder(
        firebase,
        env,
        {
          orderId: capturedOrderId,
          payPalSuccessDetails: orderdDetailsWithImg,
          payPalSuccessData: data,
        },
      );

      console.log('-- res_ confirmOrderId :', confirmOrderId);

      // TODO: create own transaction log doc with group booking/meals/transport details

      // if (hasNotDefaultPickupOptions) {
      //   console.log('hasNotDefaultPickupOptions => submitParticipantInformation');
      //   // TODO: submit participant data to eventOrderDocument
      //   const orderId = details.id;
      //   console.log('submitParticipantInformation orderId: ', orderId);
      //   const submitParticipantInformation = httpsCallable(
      //     getFunctions(firebase),
      //     'orderFunction-submitInitialParticipants',
      //   );
      //   await submitParticipantInformation({
      //     cart: { items: cartItems, currency }, // TODO: submit whole cart here?
      //     orderId, // pp orderId
      //   });
      // }

      setOrderDataState(null);

      // it can't be successful if confirmOrderIs is null or undefined
      createStackedNotification(
        NotificationType.SUCCESS,
        <Grid container>
          <Grid item xs={12}>
            {`Your order was successful (OrderId: ${confirmOrderId})`}
          </Grid>
        </Grid>,
      );

      // NOTE: delete cart only after a successful checkout procedure
      if (confirmOrderId) await deleteCartItems(cartItems);
    } catch (err) {
      console.log('error: ', err);
      createStackedNotification(
        NotificationType.ERROR,
        `Could not create order complete document, please call our support hotline (OrderId: ${capturedOrderId})`,
        999999,
      );
    } finally {
      // NOTE: cleanup after request
      setIsRequestingUpdate(false);
      setCapturedOrderId(null);
    }
  };

  // TODO:
  const createParticipantError = (details:any, data:any) => {
    createStackedNotification(NotificationType.ERROR, 'Participant data not complete');
    throw new Error('invalid-parms');
  };

  // const createOrder =
  //   (/* orderSysId: string, data: {}, actions: PaypalButtonActions */): PaypalOrderData => {
  //     // console.log('createOrder orderSysId: ', orderSysId);
  //     // console.log('createOrder data: ', data);
  //     // console.log('createOrder actions: ', actions);

  //     const orderData: PaypalOrderData = getOrderData(
  //       // 'orderSysId',
  //       currency,
  //       cartItems,
  //       sourceProducts,
  //       user.uid,
  //     );

  //     console.log('createOrder orderData: ', orderData);
  //     return orderData;
  //   };

  // const createClientOrderDocument = async (
  //   orderData: PaypalOrderData,
  //   successData: PaypalSuccessData,
  //   successDetails: PaypalSuccessDetails,
  // ) => {
  //   try {
  //     const clientOrderDocumentData: UserCheckoutParams = {
  //       orderCart: replaceCartPartipantIds({ items: cartItems, currency }, firebase),
  //       orderData,
  //       successData,
  //       successDetails,
  //     };
  //     console.log(
  //       'createClientOrderDocument - clientOrderDocumentData: ',
  //       clientOrderDocumentData,
  //     );

  //     const onOrder = httpsCallable(getFunctions(firebase), 'orderFunction-onOrder');

  //     await onOrder(clientOrderDocumentData);
  //   } catch (e) {
  //     console.warn('Error: ', e);
  //     createStackedNotification(
  //       NotificationType.ERROR,
  //       <Grid container>
  //         <Grid item xs={12}>
  //           {`Error ${e?.message || ''}`}
  //         </Grid>
  //       </Grid>,
  //     );
  //   }
  // };

  // const onSuccess = async (details: PaypalSuccessDetails, data: PaypalSuccessData) => {
  //   console.log(`xx onSuccess Transaction completed by ${details.payer.name.given_name}`);
  //   console.log(`xx onSuccess Transaction details ${JSON.stringify(details)}`);
  //   console.log(`xx onSuccess Transaction data ${JSON.stringify(data)}`);

  //   if (!orderDataState) {
  //     createStackedNotification(
  //       NotificationType.ERROR,
  //       <Grid container>
  //         <Grid item xs={12}>
  //           {'Could not create booking document, please call our support hotline'}
  //         </Grid>
  //       </Grid>,
  //     );
  //     return;
  //   }

  //   // TODO: transfer participant information into db order doc to be merge by the BE into the final order document
  //   await createClientOrderDocument(orderDataState, data, details); // FIXME:

  //   if (hasNotDefaultPickupOptions) {
  //     console.log('hasNotDefaultPickupOptions => submitParticipantInformation');
  //     // TODO: submit participant data to eventOrderDocument
  //     const orderId = details.id;
  //     console.log('submitParticipantInformation orderId: ', orderId);
  //     const submitParticipantInformation = httpsCallable(
  //       getFunctions(firebase),
  //       'orderFunction-submitInitialParticipants',
  //     );
  //     await submitParticipantInformation({
  //       cart: { items: cartItems, currency }, // TODO: submit whole cart here?
  //       orderId, // pp orderId
  //     });
  //   }
  //   setOrderDataState(null);

  //   // TODO: create own transaction log doc with group booking/meals/transport details
  //   createStackedNotification(
  //     NotificationType.SUCCESS,
  //     <Grid container>
  //       <Grid item xs={12}>
  //         Your order was successful
  //       </Grid>
  //     </Grid>,
  //   );
  //   await deleteCartItems(cartItems);
  //   setIsRequestingUpdate(false);
  //   // TODO: redirect to history page with details?
  // };

  const handleError = (err: {}) => {
    console.warn('pp button err: ', err);
    setIsRequestingUpdate(false);
  };

  // FIXME:
  // perform validation of cart data serverside => callable (create cart logic on BE then?)
  // (create validation secret through some uid combinations (reference_id?) + hash it) => 'orderSignToken' create function to compare hashes afterwards (BE)
  // get result (hash or complete cart?)
  // call original onClick with injected BE hash or cart

  const isCartPriceZero = (items: ShoppingCartItemDocumentData[]) => {
    const price = calculateTotalPrice(getCartItemsTotalPrices(items, sourceProducts));
    return !!(price.integer === 0 && price.decimal === 0);
  };

  return (
    <>
      {/* {hasNotDefaultPickupOptions ? <div>HasNotDefaultPickupOptions</div> : null}  // TODO */}
      
      {isPaypalLoading ? <LoadingIndicator /> : null}
      {hasPaypalClientId ? (
        <PayPalButton
          options={paypalOptions}
          currency={ currency as Currency}
          // amount={totalAmount}
          // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
          createOrder={async (data: {}, actions: PaypalButtonActions) => {
            console.log('---- data ----');
            console.log(data);
            console.log('------------');
            // NOTE: fulfill preconditions
            // FIXME:
            // if (!areParticipantsValid) {
            //   return createParticipantError(data, actions);
            // }
            console.log('-- creating order - paypalClientId: ', paypalClientId);
            if (isCartPriceZero(cartItems)) {
              return createPriceZeroError();
            }

            console.log(
              '-- creating order - isCartPriceZero: ',
              isCartPriceZero(cartItems),
            );

            // NOTE: send capture request to BE to receive capture doc orderId

            const orderId = await captureOrder();
            console.log('-- creating order1 - orderId: ', orderId);
            if (!orderId) {
              console.log('-- creating order2 - orderId: ', orderId);
              createStackedNotification(NotificationType.ERROR, 'Order capture error');
              throw new Error('invalid-params');
            }

            console.log('-- creating order3 - orderId: ', orderId);

            // NOTE: create pp compatible order data

            const orderData = await createOrderMinimal(orderId);
            console.log('orderData',orderData);
             // NOTE: this could be done in the BE later in Checkout V2
            if (!orderData) {
              createStackedNotification(NotificationType.ERROR, 'Order data error');
              throw new Error('invalid-params');
            }

            // const orderData = createOrder(/* 'orderSysId', data, actions */); // TODO: create minimal submit data version
            // const { orderToken, orderSysId } = await validateOrderData(orderData);
            // console.log('orderSysId: ', orderSysId);
            // if (!orderToken || !orderSysId) {
            //   // FIXME: create separate error or generify this
            //   return createParticipantError(data, actions);
            // }

            setOrderDataState(orderData); // TODO: saving necessary?
            setIsRequestingUpdate(true);

            console.log('-- order - orderId: ', orderId);
            console.log('-- order - orderData: ', orderData);
            return actions.order.create(orderData);
          }}
          // onApprove={onApprove}
          // onSuccess={onSuccess}
          onSuccess={completeOrder}
          catchError={handleError}
          onError={handleError}
          onButtonReady={() => setIsPaypalLoading(false)}
        />
      ) : null}
    </>
  );
};



checkoutbox.tsx


import * as React from 'react';

import {
  ButtonTw,
  Localized
} from 'src/app/components';
import { Price } from 'src/app/types';
import { useShoppingCartContext } from 'src/app/context';
import { AppFeature } from 'src/app/constants';
import { calculateTotalPrice, getCartItemsTotalPrices } from 'src/lib/checkout';
import {
  useAppContext,
  useAppFeatures,
  useAppStaticQueryConfig,
  useLocalizedNavigation,
} from 'src/app/hooks';

import { CheckoutButton } from './CheckoutButton';
import { PriceTotalSummary } from './PriceTotalSummary';

export interface CheckoutBoxProps {
  i18nPath: string;
}

export const CheckoutBox = (props: CheckoutBoxProps) => {
  const { i18nPath } = props;
  const {
    // areParticipantsValid, // TODO: implement correctly
    cartItems,
    sourceProducts,
  } = useShoppingCartContext();
  const { currencyId, isOrganisationUser } = useAppContext();
  const { navigateLocalized } = useLocalizedNavigation();
  const appConfig = useAppStaticQueryConfig();
  const isProduction = Boolean(appConfig.env === 'PRODUCTION'); // FIXME: remove later or use FLAG fetched from BE (use fb appConfig)
  const hasUserCheckoutFeature = true;
  // const { hasFeature: hasUserCheckoutFeature } = useAppFeatures(AppFeature.USER_CHECKOUT);

  const cartItemTotalPrices: Price[] = [
    ...getCartItemsTotalPrices(cartItems, sourceProducts),
  ];

  const totalPrice = calculateTotalPrice(cartItemTotalPrices);
  console.log('totalPrice',cartItemTotalPrices);

  const isPriceValid = !(
    Number.isNaN(totalPrice.integer) ||
    Number.isNaN(totalPrice.decimal) ||
    totalPrice.integer < 0 ||
    totalPrice.decimal < 0
  ); // FIXME: better validation needed

  return (
    <div className='px-7 md:px-8 py-12 border-2 rounded-2xl border-accent-500 flex flex-col gap-y-12 dark:border-primary-500 z-0 relative'>
      <div>
        <PriceTotalSummary
          currencyId={currencyId}
          i18nPath={i18nPath}
          itemCount={cartItems.length}
          totalPrice={totalPrice}
        />
      </div>
      <div className='text-center md:w-[270px] md:mx-auto flex flex-col gap-y-3'>
        {/* {!areParticipantsValid ? (
          <Typography paragraph color={'error'} align={'center'}>
            <Localized dictKey={`${i18nPath}.error.participants-incomplete-error`} />
          </Typography>
        ) : null} */}
        {isProduction ? (
          <p className='text-danger-500 font-semibold py-2'>
            {'Checkout is currently disabled'}
          </p>
        ) : null}
        {isPriceValid && hasUserCheckoutFeature ? (
          <CheckoutButton
          totalPrice={totalPrice}
           />
        ) : (
          <>
            {!hasUserCheckoutFeature ? (
              <>
                {isOrganisationUser ? (
                  <p className='text-danger-500 font-semibold py-2 text-center'>
                    <Localized
                      dictKey={`${i18nPath}.error.organisation-account-in-use-error`}
                    />
                  </p>
                ) : (
                  <p className='text-danger-500 font-semibold py-2 text-center'>
                    <Localized dictKey={`${i18nPath}.error.not-logged-in-error`} />
                  </p>
                )}
              </>
            ) : (
              <p className='text-danger-500 font-semibold py-2 text-center'>
                <Localized
                  dictKey={`${i18nPath}.error.total-price-calculation-error`}
                />
              </p>
            )}
          </>
        )}
        <ButtonTw
          onClick={() => navigateLocalized('/activity-000')}
          rounded
          size={'lg'}
          variant={'accent'}
          className='w-full'
        >
          <Localized dictKey={`${i18nPath}.action.navigate-to-products.label`} />
        </ButtonTw>
      </div>
      <div className='text-center flex flex-col gap-y-2'>
        <p>
          <Localized dictKey={`${i18nPath}.hint.create-account`} />
        </p>
        <p className='font-semibold'>
          <Localized dictKey={`${i18nPath}.hint.best-price`} />
        </p>
      </div>
    </div>
  );
};

